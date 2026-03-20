import { Server } from "socket.io";
import cookie from "cookie"
import jwt from "jsonwebtoken"
import { createChatTitle,messageAi } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

let io

export function initsocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })
    io.use((socket, next) => {
        try {
            const cookieString = socket.request.headers.cookie
            if (!cookieString) {
                return next(new Error("Authentication error: No cookies found"))
            }
            const cookies = cookie.parse(cookieString)
            const { token } = cookies
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.userId = decoded.id
            next()
        } catch (error) {
            console.log("Socket Auth Error:", error.message)
            return next(new Error("Authentication error: Token expired or invalid"))
        }
    })

    io.on("connection", (socket) => {
        console.log("New Authenticated Socket connected:", socket.id, "User ID:", socket.userId)
        socket.on("send_message", async (data) => {
            const { message, chatId } = data
            const userId = socket.userId
            try {
                let currentChatId = chatId
                let chatTitle = null
                if (!currentChatId) {
                    chatTitle = await createChatTitle(message)
                    const chat = await chatModel.create({
                        user: userId,
                        title: chatTitle
                    })
                    currentChatId = chat._id
                    socket.emit("chat_created", {
                        chatId: currentChatId,
                        title: chatTitle,
                        userMessage: message
                    })
                }
                await messageModel.create({
                    chat: currentChatId,
                    content: message,
                    role: "user"
                })
                const messages = await messageModel.find({ chat: currentChatId })
                const reply = await messageAi(messages, socket, currentChatId)
                await messageModel.create({
                    chat: currentChatId,
                    content: reply,
                    role: "ai"
                })
            } catch (error) {
                console.error("Error processing message:", error)
                socket.emit("error", { message: "Failed to generate reply" })
            }
        })
    })
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io is not initialized")
    }
    return io
}