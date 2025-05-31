"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Minimize2, Maximize2, RotateCcw } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "../Pages/AuthProvider"
import { useNavigate } from "react-router-dom"

// Mock data for chat messages
const initialMessages = [
    {
        id: 1,
        sender: "system",
        content: "Welcome to Adventure Bookings! How can we help you today?",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
]

// Predefined questions for quick start
const predefinedQuestions = [
    {
        id: "register",
        question: "How to register?",
        response: "To register, click on the 'Sign Up' button in the top right corner of our website. Fill in your details including name, email, and password. You'll receive a confirmation email to verify your account."
    },
    {
        id: "book",
        question: "How to book an adventure?",
        response: "To book an adventure: 1) Browse our available adventures, 2) Select your preferred date and time, 3) Add it to your cart, 4) Proceed to checkout and complete payment. You'll receive a confirmation email with all details."
    },
    {
        id: "types",
        question: "What types of adventures are available?",
        response: "We offer various adventure types including hiking, rock climbing, water sports, wildlife safaris, mountain biking, paragliding, and cultural tours. Each adventure is designed for different skill levels from beginner to advanced."
    },
    {
        id: "locations",
        question: "What locations are you available in?",
        response: "We operate in multiple exciting destinations including mountain ranges, coastal areas, national parks, and adventure hotspots. Check our locations page for the complete list of available destinations near you."
    },
    {
        id: "support",
        question: "Contact Support",
        response: "You're now connected to our support team. Please describe your issue and we'll assist you as soon as possible. For urgent matters, you can also call our 24/7 helpline."
    }
]

export default function ChatWidget() {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState(initialMessages)
    const [showPredefinedQuestions, setShowPredefinedQuestions] = useState(true)
    const messagesEndRef = useRef(null)
    const navigate = useNavigate()

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

    // Handle predefined question click
    const handlePredefinedQuestion = (questionData) => {
        // Special handling for support - redirect to tickets page
        if (questionData.id === "support") {
            navigate("/dashboard/tickets")
            setIsOpen(false)
            return
        }

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            sender: "user",
            content: questionData.question,
            timestamp: new Date().toISOString(),
        }

        setMessages(prev => [...prev, userMessage])

        // Add agent response after a short delay
        setTimeout(() => {
            const agentMessage = {
                id: messages.length + 2,
                sender: "agent",
                content: questionData.response,
                timestamp: new Date().toISOString(),
            }
            setMessages((prev) => [...prev, agentMessage])
        }, 1000)
    }    // Reset chat to initial state
    const resetChat = () => {
        setMessages(initialMessages)
        setShowPredefinedQuestions(true)
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
                    >                        {/* Chat header */}
                        <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                            <h3 className="font-medium">Adventure Support</h3>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={resetChat} 
                                    className="text-white hover:text-blue-100"
                                    title="Reset chat"
                                >
                                    <RotateCcw size={18} />
                                </button>
                                <button onClick={toggleMinimize} className="text-white hover:text-blue-100">
                                    {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                                </button>
                                <button onClick={toggleChat} className="text-white hover:text-blue-100">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>                        {/* Chat messages */}
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

                                {/* Predefined Questions */}
                                {showPredefinedQuestions && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
                                        <div className="space-y-2">
                                            {predefinedQuestions.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handlePredefinedQuestion(item)}
                                                    className="w-full text-left p-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                                >
                                                    {item.question}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
