import { app } from "./app.js";
import dotenv from 'dotenv'

dotenv.config({
    path:"./.env"
})

app.listen(process.env.PORT || 6000 , ()=>{
    console.log(`server is running on PORT : ${process.env.PORT}`);
    
})