import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { SystemMessage, HumanMessage, AIMessage, tool, createAgent } from "langchain"
import { internetSearch } from "./internet.service.js";
import * as z from 'zod'

const geminiChatModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite-preview",
    apiKey: process.env.GEMINI_API_KEY,
    streaming:true
});

const internetSearchTool = tool(
    internetSearch,
    {
        name: "LatestInfoInternetSearch",
        description: "Use this tool to search the internet for the latest news, current events, real-time information, or facts you do not already know. Always use this if the user asks about recent events.",
        schema: z.object({
            query: z.string().describe("Prompt for the requirement which should be search through Internet")
        })
    }
)

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
})

const geminiGemmaTitleModel = new ChatGoogleGenerativeAI({
    model: "gemma-3-27b-it",
    apiKey: process.env.GEMINI_API_KEY
});

const agent = createAgent({
    model: geminiChatModel,
    tools: [internetSearchTool]
})



export async function messageAi(messages, socket, chatId) {
    const currentDate = new Date().toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    console.log(currentDate);
    const response = await agent.invoke(
        {
            messages: [
                new SystemMessage(
                    `You are Fab AI, a highly capable and helpful AI assistant. 
        You were created by Mohammed Issaqh. 
        CRITICAL INSTRUCTION: If asked about your identity, name, or creator, you MUST state that you are Fab AI and you were created by Mohammed Issaqh. Never mention Google, Gemini, or being a large language model.
                    
        You are a helpful AI assistant. Today's date is ${currentDate}. 
        CRITICAL: If the user asks about current events, news, sports scores, 
        or any information after your training data, you MUST use the 
        'LatestInfoInternetSearch' tool to provide accurate, real-time information.`
                ),
                ...messages.map((msg) => {
                    if (msg.role === "user") {
                        return new HumanMessage(msg.content)
                    }
                    else if (msg.role === "ai") {
                        return new AIMessage(msg.content)
                    }
                })
            ]
        },
        {
            callbacks:[
                {
                    handleLLMNewToken(token){
                        socket.emit("ai_message_chunk",{ chatId, chunk: token })
                    }
                }
            ]
        }
    )
    socket.emit("ai_message_complete", { chatId })
    return response.messages[response.messages.length - 1].text
}

export async function createChatTitle(message) {
    const response = await geminiGemmaTitleModel.invoke([
        new HumanMessage(`
            INSTRUCTION: You are a helpful assistant that generates concise and descriptive titles (2-4 words).
            
            TASK: Generate a title for this specific message:
            "${message}"
            
            Output ONLY the title text.
        `)
    ])
    return response.text
}

