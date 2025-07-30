import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.schema({
    userName:{
        type:String,
        requrired:true,
        unique:true,
        lowerCase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        requrired:true,
        unique:true,
        lowerCase:true,
        trim:true
    },
    fullName:{
        type:String,
        requrired:true,
        trim:true
    },
    password:{
        type:String,
        requrired:true,
    },
    profileImage:{
        type:String,
        requrired:true
    },
    role:{
        type:String,
        enum:[ADMIN,USER],
        default:USER
    },
    accessToken:{
        type:String,
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});

//Hash Password
userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password , 12)
    next()
})
//Check correct Password
userSchema.method.isPasswordCorrect=async function(password) {
    return await bcrypt.compare(password,this.password)
}
//accesstoken
userSchema.method.generateAccessToken=async function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        userName:this.userName,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)
}
//refreshtoken
userSchema.method.generateRefreshToken=async function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)
}

export const User=mongoose.model("User",userSchema)