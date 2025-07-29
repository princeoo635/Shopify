import { app } from "./app.js";
import dotenv from 'dotenv'
import connectDB from './db/connect.js'; 
dotenv.config({
    path:"./.env"
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 6000 , ()=>{
        console.log(`server is running on PORT : ${process.env.PORT}`);

    })
})
.catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
});