import axios from "axios"

const api=axios.create({
    baseURL:"http://localhost:3000/api/chats",
    withCredentials:true
})




export async function getChats() {
    const response=await api.get("/")
    return response.data
}

export async function getMessages(chatId) {
    const response=await api.get(`/${chatId}/messages`)
    return response.data
}

