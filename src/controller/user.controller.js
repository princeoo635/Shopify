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
.json(
    new ApiResponse(200,
        {
            user:loggedInUser,
            accessToken,
            refreshToken
        },"user logged in successfully."
    )
)
})



export {
    registerUser,
    loginUser,
    logoutUser
}