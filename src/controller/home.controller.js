import {asyncHandler} from '../utils/asyncHandler.js'

const home=asyncHandler(async(req,res)=>{
    res.render("home")
})


export {
    home
}