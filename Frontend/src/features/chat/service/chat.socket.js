import {io} from 'socket.io-client'
import { createNewChat, createNewMessage, endAiMessageStream, setCurrentChatId, streamAiMessageChunk } from '../chat.slice'

let socketInstance
export const initializeSocketConnection=(dispatch)=>{
    socketInstance=io("https://fab-ai.onrender.com",{
        withCredentials:true
    })
    socketInstance.on("connect",()=>{
        console.log("Connected to Socket.IO server")
    })
    socketInstance.on("chat_created",(data)=>{
        const { chatId, title, userMessage } = data
        dispatch(createNewChat({chatId,title}))
        dispatch(setCurrentChatId(chatId))
        dispatch(createNewMessage({chatId,role:"user",content:userMessage}))
    })
    socketInstance.on("ai_message_chunk",(data)=>{
        const {chatId,chunk}=data
        dispatch(streamAiMessageChunk({chatId,content:chunk}))
    })
    socketInstance.on("ai_message_complete",(data)=>{
        const {chatId}=data
        dispatch(endAiMessageStream({chatId}))
    })
}

export const sendSocketMessage=(eventName, data)=>{
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    } else {
        console.error("Socket is not connected yet!");
    }
}