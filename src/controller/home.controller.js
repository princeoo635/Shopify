import {asyncHandler} from '../utils/asyncHandler.js'

const home=asyncHandler(async(req,res)=>{
    res.render("home")
})
const login=asyncHandler(async(req,res)=>{
    res.render("login")
})
const register=asyncHandler(async(req,res)=>{
    res.render("register")
})
const updateUser=asyncHandler(async(req,res)=>{
    res.render("updateUser",{user:req.user})
})


export {
    home,
    login,
    register,
    updateUser
}