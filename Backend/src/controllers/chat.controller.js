import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"
import { createChatTitle, messageAi } from "../services/ai.service.js"



export async function sendMessage(req, res) {
    const user = req.user.id
    const { message, chatId } = req.body

    let chat = null, chatTitle = null

    if (!chatId) {
        chatTitle = await createChatTitle(message)

        chat = await chatModel.create({
            user,
            title: chatTitle
        })
    }

    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: message,
        role: "user"
    })

    const messages = await messageModel.find({ chat: chatId || chat._id })
    const reply = await messageAi(messages)

    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: reply,
        role: "ai"
    })
    res.status(201).json({
        chatTitle,
        aiMessage,
        chat
    })
}

export async function getChats(req, res) {
    const user = req.user.id
    const chats=await chatModel.find({user})
    res.status(200).json({
        message:"Chats fetched successfully",
        chats
    })
}

export async function getMessages(req,res) {
    const {chatId}=req.params
    const user=req.user.id
    const chat=await chatModel.findOne({user,_id:chatId})
    if(!chat){
        return res.status(404).json({
            message:"Chat doesn't belong to user or not found"
        })
    }
    const messages=await messageModel.find({chat:chatId})
    res.status(200).json({
        message:"Chat messages fetched successfully",
        messages
    })
}

export async function deleteChat(req,res) {
    const {chatId}=req.params
    const user=req.user.id
    const chat=await chatModel.findOne({user,_id:chatId})
    if(!chat){
        return res.status(404).json({
            message:"Chat doesn't belong to user or not found"
        })
    }
    await chatModel.findByIdAndDelete(chatId)
    const messagesDelete=await messageModel.deleteMany({chat:chatId})
    res.status(200).json({
        message:"Chat deleted successfully",
        messagesDelete
    })
}