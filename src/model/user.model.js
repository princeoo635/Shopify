import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER"
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
    this.password=await bcrypt.hash(this.password , 12)
    next()
})
//Check correct Password
userSchema.methods.isPasswordCorrect=async function(password) {
    return await bcrypt.compare(password,this.password)
}
//accesstoken
userSchema.methods.generateAccessToken= function(){
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
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)
}

export const User=mongoose.model("User",userSchema)