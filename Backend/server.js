import dotenv from "dotenv";
dotenv.config({path: "./.env"});

import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db.config.js";
import authRoute from "./routes/auth.routes.js"
import adventureRoute from "./routes/adventure.routes.js"
import userRoute from "./routes/user.routes.js"
import { initCloudinary } from "./utils/cloudinary.js";


const app = express();
app.use(cors({origin: "http://localhost:5173", credentials: true}));

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/adventure", adventureRoute);
app.use("/api/user", userRoute);


const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    initCloudinary();
})




