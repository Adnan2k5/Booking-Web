import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import route from "./Routes/authRoutes.js"
import connectDB from "./Config/Db.js";
const app = express();
app.use(cors());
app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));



const corsOptions = {
    origin: "http://localhost:5173",
    methods: '*',
    allowedHeaders: '*',
}

const PORT = process.env.PORT || 8080;

app.get("/", (req,res)=>{
    res.send("Welcome to the server");
})


app.use("/api/auth", route);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})




