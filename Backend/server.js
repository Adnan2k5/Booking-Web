import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoute from "./routes/auth.routes.js"
import connectDB from "./config/db.config.js";


const app = express();
app.use(cors());
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));



const corsOptions = {
    origin: "http://localhost:5173",
    methods: '*',
    allowedHeaders: '*',
}



// Routes
app.use("/api/auth", authRoute);


app.get("/", (req,res)=>{
    res.send("Welcome to the server");
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})




