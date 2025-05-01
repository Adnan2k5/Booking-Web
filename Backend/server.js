import dotenv from "dotenv";
dotenv.config({path: "./.env"});

import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db.config.js";
import authRoute from "./routes/auth.routes.js"
import adventureRoute from "./routes/adventure.routes.js"
import tickerRoute from "./routes/ticket.route.js"
import userRoute from "./routes/user.routes.js"
import termRouter from "./routes/terms.routes.js";
import documentRouter from "./routes/document.routes.js";
import messageRoute from "./routes/message.routes.js";
import sessionRouter from "./routes/session.routes.js";
import { initCloudinary } from "./utils/cloudinary.js";
import { ensureDefaultTerms } from "./controllers/terms.controller.js";
import initSocketIO from "./socket/socket.js";
import { createServer } from "http";
import { Server } from "socket.io";


const app = express();

// Create HTTP server using Express app
const server = createServer(app);
// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(cors({origin: "http://localhost:5173", credentials: true}));

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

initSocketIO(io);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/adventure", adventureRoute);
app.use("/api/user", userRoute);
app.use("/api/ticket", tickerRoute);
app.use("/api/terms", termRouter);
app.use("/api/document", documentRouter);
app.use("/api/messages", messageRoute);
app.use("/api/session", sessionRouter);


const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
    initCloudinary();
    ensureDefaultTerms();
})




