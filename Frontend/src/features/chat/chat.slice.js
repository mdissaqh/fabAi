import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null
    },
    reducers: {
        createNewChat: (state, action) => {
            const { title, chatId } = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString()
            }
        },
        createNewMessage: (state, action) => {
            const { chatId, role, content } = action.payload
            state.chats[chatId].messages.push({ content, role })
        },
        streamAiMessageChunk: (state, action) => {
            const { chatId, content } = action.payload
            const chat = state.chats[chatId]
            if (!chat) return

            const lastMessage = chat.messages[chat.messages.length - 1]

            if (lastMessage && lastMessage.role === "ai" && lastMessage.isStreaming) {
                lastMessage.content += content
            } else {
                chat.messages.push({
                    role: "ai",
                    content: content,
                    isStreaming: true
                })
            }
        },

        endAiMessageStream: (state, action) => {
            const { chatId } = action.payload
            const chat = state.chats[chatId]
            if (!chat) return

            const lastMessage = chat.messages[chat.messages.length - 1]
            if (lastMessage && lastMessage.role === "ai") {
                lastMessage.isStreaming = false
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[chatId].messages.push(...messages)
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { createNewChat, createNewMessage, addMessages,streamAiMessageChunk, endAiMessageStream, setChats, setCurrentChatId, setLoading, setError } = chatSlice.actions

export default chatSlice.reducer