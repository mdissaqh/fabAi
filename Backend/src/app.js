import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
import morgan from "morgan";
import chatRouter from "./routes/chat.routes.js";

const app = express();

app.use(express.static("./public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(morgan("dev"))

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Server is awake!" });
})

app.use("/api/auth", authRouter);
app.use("/api/chats",chatRouter)

export default app;