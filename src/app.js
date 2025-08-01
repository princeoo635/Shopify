import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import ejs from "ejs"
import path from 'path'
const app =express()
app.set("view engine",'ejs')
app.set("views",path.resolve('./views'))
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"))
app.use(cookieParser())

//import Routes
import userRouter from './routes/user.routes.js'

app.use('/api/v1/users',userRouter)

export {app}