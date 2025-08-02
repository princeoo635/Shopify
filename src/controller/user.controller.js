import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../model/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'

const option={
    httpOnly:true,
    secure:true
}

//generate access token and refresh token
const generateAccessTokenAndRefreshToken = async(userId)=>{
    try{
        const user =await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken=refreshToken
        user.accessToken=accessToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refreshToken}
    }catch(error){
       throw new ApiError(500,"Something went wrong while generating refresh and access token")  
    }
}

//register User
const registerUser=asyncHandler(
async (req,res,next)=>{
    const {fullName,email,userName,password}=req.body;
    if([fullName,email,userName,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required.");
    }
    const existedUser=await User.findOne({
        $or:[{userName},{email}]
    })
    
    if(existedUser){
        throw new ApiError(409,"User already exists.")
    }
    const profileImageLocalPath = req.file?.path;
    const profileImage=await uploadOnCloudinary(profileImageLocalPath)
    if(!profileImage){
        throw new ApiError(400,"profileImage is required.")
    }
    const user=await User.create({
        fullName,
        profileImage:profileImage.url,
        email,
        password,
        userName
    })
    const createdUser=await User.findById(user._id)
    .select('-password -refreshToken -accessToken')
    if(!createdUser){
        throw new ApiError(500,"unable to register user.")
    }
    return res.status(201).json(
        new ApiResponse(201,createdUser,"User created successfully.")
    )
});

//logged in User
const loginUser=asyncHandler(async(req,res)=>{
const {userName,email,password}=req.body
if(!(userName || email)){
    throw new ApiError(400,"Username or email is required.")
}
const user = await User.findOne({
    $or:[{userName},{email}]
})
if(!user){
    throw new ApiError(404,"User does not exists.")
}
const isPasswordValid = await user.isPasswordCorrect(password)
if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials.")
}
const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
const loggedInUser=await User.findById(user._id)
.select('-password -refreshToken -accessToken');

return res.status(200)
.cookie("accessToken",accessToken,option)
.cookie("refreshToken",refreshToken,option)
.render("home",
        {
            user:loggedInUser,
            accessToken,
            refreshToken
        }
    )

})

//logout
const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $unset:{
            refreshToken:"",
            accessToken:""
        }
    },{
        new: true
    });
    return res.status(200)
    .clearCookie("refreshToken",option)
    .clearCookie("accessToken",option)
    .json(
        new ApiResponse(200,{},"User logout successfully.")
    )
})

const getCurrentUser=asyncHandler(async (req,res)=>{
    return res.status(200)
    .json(
        new ApiResponse(200,req.user,"Current User fetched successfully")
    )
})

//update profile image
const changeProfile =asyncHandler(
    async(req,res)=>{
        const profileImageLocalPath =req.file?.path;
        if(!profileImageLocalPath){
            throw new ApiError(400,"profile image is required.")
        }
        const profileImage= await uploadOnCloudinary(profileImageLocalPath)
        if(!profileImage.url){
            throw new ApiError(400,"unable to upload on cloudinary.")
        }
        const user=await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{profileImage:profileImage.url}
            },
            {
                new:true
            }
        ).select('-password -refreshToken -accessToken')
        return res.status(200)
        .json(new ApiResponse(200,user,"profile image updated successfully."))
    }
)
//update user info
const updateUserDetail=asyncHandler(
    async(req,res)=>{
        const {fullName,email,userName} =req.body
        if(!(fullName&&email&&userName)){
            throw new ApiError(400,"fullName,userName and email is required.")
        }
        const user=await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{fullName,email,userName}
            },{
                new:true
            }
        ).select('-password -refreshToken -accessToken')
        return res.status(200)
        .json(new ApiResponse(200,user,"User details are updated."))
    }
)

//change password
const changePassword=asyncHandler(
    async(req,res)=>{
        const{oldPassword,newPassword}=req.body
        if(!(oldPassword && newPassword)){
            throw new ApiError(400,"Both old and new Password is required...")
        }
        const user=await User.findById(req.user._id)
        const isPasswordValid=await user.isPasswordCorrect(oldPassword)
        if(!isPasswordValid){
            throw new ApiError(400,"Incorrect password.")
        }
        user.password = newPassword; 
        const updatedUser=await user.save({ validateBeforeSave: true })
       const { password, refreshToken, accessToken, ...safeUser } = updatedUser.toObject();
        return res.status(200)
        .json(new ApiResponse(200,safeUser,"User password is updated."))
    }
)

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changeProfile,
    updateUserDetail,
    changePassword
}