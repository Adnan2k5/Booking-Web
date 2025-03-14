import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoute from "./routes/auth.routes.js"
import adventureRoute from "./routes/adventure.routes.js"
import connectDB from "./config/db.config.js";

const app = express();
app.use(cors({origin: "http://localhost:5173", credentials: true}));

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/adventure", adventureRoute);


const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})




