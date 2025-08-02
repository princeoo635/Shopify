import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import ejs from "ejs"
import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const dir = dirname(__filename);
const app =express()
app.set("view engine","ejs")
app.set("views", path.resolve(dir, './views'));
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
import homeRouter from './routes/home.routes.js'
app.use('/api/v1',homeRouter)
app.use('/api/v1/users',userRouter)


export {app}