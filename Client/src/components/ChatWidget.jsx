"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "../Pages/AuthProvider"

// Mock data for chat messages
const initialMessages = [
    {
        id: 1,
        sender: "system",
        content: "Welcome to Adventure Bookings! How can we help you today?",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
]

export default function ChatWidget() {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState("")
    const messagesEndRef = useRef(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current && isOpen && !isMinimized) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen, isMinimized])

    const toggleChat = () => {
        setIsOpen(!isOpen)
        if (isMinimized) setIsMinimized(false)
    }

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized)
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            sender: "user",
            content: newMessage,
            timestamp: new Date().toISOString(),
        }

        setMessages([...messages, userMessage])
        setNewMessage("")

        // Simulate agent response after a short delay
        setTimeout(() => {
            const agentMessage = {
                id: messages.length + 2,
                sender: "agent",
                content: getAutoResponse(newMessage),
                timestamp: new Date().toISOString(),
            }
            setMessages((prev) => [...prev, agentMessage])
        }, 1000)
    }

    // Simple auto-response function
    const getAutoResponse = (message) => {
        const lowerMessage = message.toLowerCase()

        if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
            return "Hello there! How can I assist you with your adventure booking today?"
        } else if (lowerMessage.includes("book") || lowerMessage.includes("reservation")) {
            return "To make a booking, you can browse our adventures and select the one you're interested in. Would you like me to guide you through the process?"
        } else if (lowerMessage.includes("cancel") || lowerMessage.includes("refund")) {
            return "For cancellations and refunds, please refer to our cancellation policy. Typically, full refunds are available up to 48 hours before your adventure."
        } else if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
            return "Our adventure prices vary based on the activity and duration. You can see the exact price on each adventure's details page. Is there a specific adventure you're interested in?"
        } else if (lowerMessage.includes("equipment") || lowerMessage.includes("gear")) {
            return "We provide all necessary equipment for our adventures. You can also rent or purchase additional gear from our shop if needed."
        } else {
            return "Thank you for your message. Our team will get back to you shortly. Is there anything else I can help you with?"
        }
    }

    // Format timestamp to readable time
    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    return (
        <>
            {/* Chat button */}
            <motion.button
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
            >
                <MessageCircle size={24} />
            </motion.button>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-50 flex flex-col"
                        style={{ height: isMinimized ? "auto" : "400px" }}
                        initial={{ opacity: 0, y: 50, height: "auto" }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            height: isMinimized ? "auto" : "400px",
                            transition: { duration: 0.3 },
                        }}
                        exit={{ opacity: 0, y: 50, transition: { duration: 0.2 } }}
                    >
                        {/* Chat header */}
                        <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                            <h3 className="font-medium">Adventure Support</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={toggleMinimize} className="text-white hover:text-blue-100">
                                    {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                                </button>
                                <button onClick={toggleChat} className="text-white hover:text-blue-100">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Chat messages */}
                        {!isMinimized && (
                            <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`mb-3 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {message.sender !== "user" && (
                                            <Avatar className="h-8 w-8 mr-2">
                                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                                <AvatarFallback className="bg-blue-600 text-white">AB</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={`max-w-[80%] rounded-lg px-3 py-2 ${message.sender === "user"
                                                    ? "bg-blue-600 text-white"
                                                    : message.sender === "agent"
                                                        ? "bg-gray-200 text-gray-800"
                                                        : "bg-blue-100 text-gray-800"
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <p className="text-xs mt-1 opacity-70 text-right">{formatTime(message.timestamp)}</p>
                                        </div>
                                        {message.sender === "user" && (
                                            <Avatar className="h-8 w-8 ml-2">
                                                <AvatarFallback className="bg-green-600 text-white">
                                                    {user?.user ? user.user.email.charAt(0).toUpperCase() : "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}

                        {/* Chat input */}
                        {!isMinimized && (
                            <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" className="bg-blue-600">
                                    <Send size={18} />
                                </Button>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
