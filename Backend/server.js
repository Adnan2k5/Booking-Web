import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoute from "./routes/auth.routes.js"
import connectDB from "./config/db.config.js";
import passport from "passport";

dotenv.config();

const app = express();
app.use(cors());

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoute);


const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})




