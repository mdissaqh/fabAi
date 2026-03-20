import React, { useEffect, useState, useRef } from 'react'
import { useChat } from '../hooks/useChat'
import '../style/dashboard.scss'
import { useSelector } from 'react-redux'
import { RiAddLine, RiArrowUpLine, RiMenuLine, RiCloseLine } from '@remixicon/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [pendingMessage, setPendingMessage] = useState(null)
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const messagesEndRef = useRef(null)

  const sortedChats = Object.values(chats).reverse()
  const currentMessages = currentChatId ? chats[currentChatId]?.messages : []
  const messageCount = currentMessages?.length || 0
  const isAIThinking = currentMessages?.length > 0 && currentMessages[currentMessages.length - 1].role === 'user'

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChatId, messageCount, pendingMessage])

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return

    if (!currentChatId) {
      setPendingMessage(trimmedMessage)
    }

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId, chats) => {
    chat.handleOpenChat(chatId, chats)
    setIsSidebarOpen(false)
    setPendingMessage(null) // Clear pending message when opening an old chat
  }

  const handleNewChat = () => {
    chat.handleOpenChat(null, chats)
    setIsSidebarOpen(false)
    setPendingMessage(null) // Clear pending message when clicking New Chat
  }

  return (
    <main className="dashboard-main">
      <div className="mobile-header">
        <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
          <RiMenuLine size={24} />
        </button>
        <span className="mobile-title">Chat Dashboard</span>
      </div>

      <div 
        className={`overlay ${isSidebarOpen ? 'show' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title-row">
            <h2 className="sidebar-title">Chats</h2>
            <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
              <RiCloseLine size={24} />
            </button>
          </div>
          <button className="new-chat-btn" onClick={handleNewChat}>
            <RiAddLine size={20} />
            <span>New Chat</span>
          </button>
        </div>
        <div className="chat-list">
          {sortedChats.map((chatItem) => (
            <button
              onClick={() => openChat(chatItem.id, chats)}
              key={chatItem.id}
              className={`chat-list-item ${chatItem.id === currentChatId ? 'active' : ''}`}
            >
              {chatItem.title}
            </button>
          ))}
        </div>
      </aside>

      <section className="chat-container">
        <div className="messages-area">
          {currentMessages?.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              {message.role === 'user' ? (
                <div className="message-bubble">{message.content}</div>
              ) : (
                <div className="message-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}

          {pendingMessage && !currentChatId && (
            <div className="message-wrapper user-message">
              <div className="message-bubble">{pendingMessage}</div>
            </div>
          )}
          
          {(isAIThinking || (pendingMessage && !currentChatId)) && (
            <div className="message-wrapper ai-message">
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <footer className="input-footer">
          <form onSubmit={handleSubmitMessage} className="input-form">
            <button type="button" className="icon-btn plus-btn" title="Add attachment">
              <RiAddLine />
            </button>
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask anything"
              className="chat-input"
            />
            <div className="input-actions">
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="send-btn"
                title="Send message"
              >
                <RiArrowUpLine />
              </button>
            </div>
          </form>
        </footer>
      </section>
    </main>
  )
}

export default Dashboard