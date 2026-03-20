import { addMessages, createNewMessage, setChats, setCurrentChatId, setLoading } from "../chat.slice";
import { getChats, getMessages } from "../service/chat.api";
import { initializeSocketConnection, sendSocketMessage } from "../service/chat.socket";
import {useDispatch} from "react-redux"


export const useChat = () => {
    const dispatch=useDispatch()

    async function handleSendMessage({message,chatId}) {
        if(chatId){
            dispatch(createNewMessage({
                chatId,
                role:"user",
                content:message
            }))
            sendSocketMessage("send_message", { message, chatId })
        }
        else{
            sendSocketMessage("send_message", { message, chatId: null })
        }
    }
    async function handleGetChats() {
        dispatch(setLoading(true))
        const data=await getChats()
        const {chats}=data
        dispatch(setChats(chats.reduce((acc,chat)=>{
            acc[chat._id]={
                id:chat._id,
                title:chat.title,
                messages:[],
                lastUpdated:chat.updatedAt
            }
            return acc
        },{})))
        dispatch(setLoading(false))
    }
    async function handleOpenChat(chatId,chats) {
        if (!chatId) {
            dispatch(setCurrentChatId(null))
            return
        }
        if(chats[chatId].messages.length==0){
            const data=await getMessages(chatId)
        const {messages}=data
        const formattedMessages=messages.map(msg=>({
            content:msg.content,
            role:msg.role
        }))
        dispatch(addMessages({
            chatId,
            messages:formattedMessages
        }))
        }
        dispatch(setCurrentChatId(chatId))
    }
    return {
        initializeSocketConnection: () => initializeSocketConnection(dispatch),
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }

}