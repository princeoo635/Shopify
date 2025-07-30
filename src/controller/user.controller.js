import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../model/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'

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
export {
    registerUser,
}