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


export {
    home,
    login,
    register
}