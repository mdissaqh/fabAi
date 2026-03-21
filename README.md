# 🤖 Fab AI - Real-Time AI Assistant

**Fab AI** is a highly responsive, full-stack conversational AI application. 

Built with the MERN stack, Socket.IO, and LangChain, Fab AI mimics the seamless experience of modern AI chatbots by streaming responses word-by-word and utilizing autonomous internet search capabilities.

## ✨ Complete Feature List

### 🧠 Core AI Capabilities
* **Real-Time Token Streaming:** Bypasses standard HTTP request latency. AI responses are generated and streamed word-by-word to the UI in milliseconds using WebSockets.
* **Agentic Internet Search:** Powered by LangChain, the AI acts as an autonomous agent. If asked about current events or real-time data, it automatically triggers a web search tool before answering.


### 🔐 Security & Authentication
* **Secure User Accounts:** Full registration and login system utilizing cookies.
* **Email Verification:** Users receive a secure link via email to verify their accounts before gaining access to the chat interface.
* **Socket Authentication:** WebSocket connections are strictly authenticated using parsed JWTs to ensure only verified users can access the AI models.

### 💻 User Experience & Interface
* **Zero-Latency Feel (Optimistic UI):** When a user starts a new chat, their message appears instantly while the backend creates the database entry and triggers the AI, preventing blank loading screens.
* **Animated Typing Indicators:** A smooth, bouncing three-dot indicator appears while the AI is "thinking" or searching the web.
* **Smart Auto-Scrolling:** The chat window automatically and smoothly scrolls to the bottom when new messages are sent or when the AI begins typing, while allowing the user to freely scroll during long responses without aggressive snapping.
* **Rich Markdown Support:** The AI's responses are rendered using `react-markdown` and `remark-gfm`, perfectly formatting code blocks, tables, bold text, and lists.
* **Responsive Dashboard:** A clean, modern UI built with SCSS featuring a collapsible sidebar for mobile devices and an edge-to-edge chat view.

### 💾 Data Management
* **Persistent Chat History:** All conversations are securely saved to MongoDB, linked specifically to the authenticated user.
* **Auto-Generated Chat Titles:** When a new conversation begins, a secondary lightweight AI model automatically reads the first message and generates a concise 2-4 word title for the sidebar.

---

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Redux Toolkit (State Management)
* React Router v6
* Socket.IO-Client
* SCSS (Custom Styling)
* React-Markdown

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* Socket.IO (WebSocket Server)
* JSON Web Tokens (JWT) & Cookie Parser

**AI & Processing:**
* LangChain Framework
* Google Generative AI (`gemini-3.1-flash-lite-preview` for chat & `gemma-3-27b-it` for titles)
