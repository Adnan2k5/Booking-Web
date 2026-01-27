"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Minimize2, Maximize2, RotateCcw, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "../Pages/AuthProvider"
import { useNavigate, useLocation } from "react-router-dom"

// Mock data for chat messages
const initialMessages = [
    {
        id: 1,
        sender: "system",
        content: "Welcome to Adventure Bookings. How can we help you today?",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
]

// Predefined questions for quick start
const predefinedQuestions = [
    {
        id: "register",
        question: "How to register?",
        response: "To register, click on the 'Sign Up' button in the top right corner. Fill in your details including name, email, and password."
    },
    {
        id: "book",
        question: "How to book an adventure?",
        response: "Browse adventures, select your date, add to cart, and checkout. It's that simple."
    },
    {
        id: "types",
        question: "Available adventure types?",
        response: "We offer hiking, rock climbing, water sports, safaris, and more. Suitable for all skill levels."
    },
    {
        id: "support",
        question: "Contact Support",
        response: "Connecting you to our support ticketing system..."
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
    const location = useLocation()

    // Check if current page is the chat page
    const isChatPage = location.pathname === '/chat'

    // If we're on the chat page, don't render the widget
    if (isChatPage) return null

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
            setTimeout(() => {
                navigate("/dashboard/tickets")
                setIsOpen(false)
            }, 1000)
        }

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            sender: "user",
            content: questionData.question,
            timestamp: new Date().toISOString(),
        }

        setMessages(prev => [...prev, userMessage])
        setShowPredefinedQuestions(false)

        // Add agent response after a short delay
        setTimeout(() => {
            const agentMessage = {
                id: messages.length + 2,
                sender: "agent",
                content: questionData.response,
                timestamp: new Date().toISOString(),
            }
            setMessages((prev) => [...prev, agentMessage])
            // Show questions again after interaction if needed, or keep them hidden
            setShowPredefinedQuestions(true)
        }, 1000)
    }

    // Reset chat to initial state
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
            <motion.div
                className="fixed bottom-6 right-6 z-[9999]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
            >
                <button
                    onClick={toggleChat}
                    className="group relative flex items-center justify-center w-12 h-12 bg-black text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
                    aria-label="Customer Support"
                >
                    <div className="absolute inset-0 rounded-full border border-white/10" />
                    {isOpen ? (
                        <X size={20} className="transition-transform duration-300 group-hover:rotate-90" />
                    ) : (
                        <MessageSquare size={20} className="" />
                    )}

                    {!isOpen && (
                        <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                        </span>
                    )}
                </button>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-20 right-6 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden z-[9999] flex flex-col border border-gray-100"
                        style={{ height: isMinimized ? "auto" : "400px" }}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            height: isMinimized ? "auto" : "400px",
                            transition: { duration: 0.2, ease: "easeOut" },
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.15 } }}
                    >
                        {/* Chat header */}
                        <div className="bg-black text-white p-4 flex justify-between items-center select-none">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <h3 className="font-medium text-sm tracking-wide">SUPPORT</h3>
                            </div>
                            <div className="flex items-center gap-1 opacity-80 lg:opacity-60 lg:hover:opacity-100 transition-opacity">
                                <button
                                    onClick={resetChat}
                                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                    title="Reset chat"
                                >
                                    <RotateCcw size={14} />
                                </button>
                                <button
                                    onClick={toggleMinimize}
                                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                                </button>
                                <button
                                    onClick={toggleChat}
                                    className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Chat message area */}
                        {!isMinimized && (
                            <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col gap-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex flex-col max-w-[85%] ${message.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                                    >
                                        <div className="flex items-end gap-2">
                                            {message.sender !== "user" && (
                                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0 mb-1">
                                                    A
                                                </div>
                                            )}

                                            <div
                                                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${message.sender === "user"
                                                    ? "bg-black text-white rounded-br-none"
                                                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                                                    }`}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                                            {formatTime(message.timestamp)}
                                        </span>
                                    </div>
                                ))}

                                <div ref={messagesEndRef} />
                            </div>
                        )}

                        {/* Footer / Input Area (Predefined Questions) */}
                        {!isMinimized && showPredefinedQuestions && (
                            <div className="p-4 bg-white border-t border-gray-100">
                                <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Suggested Options</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {predefinedQuestions.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handlePredefinedQuestion(item)}
                                            className="text-left px-4 py-3 text-sm bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all duration-200 group flex items-center justify-between"
                                        >
                                            <span>{item.question}</span>
                                            <Send size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
