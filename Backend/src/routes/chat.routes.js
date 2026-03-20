import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { deleteChat, getChats, getMessages, sendMessage } from "../controllers/chat.controller.js";

const chatRouter=Router()

/**
 * @routes POST /api/chats/message
 */

chatRouter.post("/message",verifyToken,sendMessage)

/**
 * @routes GET /api/chats
 */

chatRouter.get("/",verifyToken,getChats)

/**
 * @routes GET /api/chats/:chatId/messages
 */

chatRouter.get("/:chatId/messages",verifyToken,getMessages)

/**
 * @routes GET /api/chats/:chatId/delete
 */

chatRouter.get("/:chatId/delete",verifyToken,deleteChat)

export default chatRouter