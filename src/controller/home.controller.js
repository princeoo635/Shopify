import {asyncHandler} from '../utils/asyncHandler.js'

const home=asyncHandler(async(req,res)=>{
    res.render("home")
})
const login=asyncHandler(async(req,res)=>{
    res.render("login")
})


export {
    home,
    login
}