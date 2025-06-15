import { useMessage } from '../../hooks/useMessage';
import { Input } from '../../components/ui/input';
import { Send } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import { useAuth } from '../AuthProvider';

// Create socket outside component to prevent multiple connections
const socket = io('http://localhost:8080', {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false, // Don't connect automatically, we'll do it in useEffect
});

export const ChatArea = ({ selectedFriend }) => {
    const friend = selectedFriend || { name: 'No Friend Selected' };
    const { user } = useAuth();
    const { messageHistory, loading, error, fetchMessageHistory } = useMessage();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const userId = user?.user?._id;

    // Connect to socket when component mounts
    useEffect(() => {
        if (userId) {
            // Connect to socket server
            socket.connect();

            // Set up event listeners
            socket.on('connect', () => {
                console.log('Connected to socket server');
                setIsConnected(true);
                socket.emit('joinRoom', { userId });
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from socket server');
                setIsConnected(false);
            });

            socket.on('receiveMessage', (message) => {
                console.log('Received message:', message);
                setMessages((prevMessages) => [...prevMessages, message]);
                // Refresh message history to ensure DB consistency
                if (friend._id) {
                    fetchMessageHistory(friend._id);
                }
            });

            // Clean up event listeners when component unmounts
            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('receiveMessage');
            };
        }
    }, [userId]);

    // Fetch message history when friend changes
    useEffect(() => {
        if (friend._id !== undefined) {
            fetchMessageHistory(friend._id);
        }
    }, [friend._id]);

    const sendMessage = () => {
        if (!messageInput.trim() || !friend._id || !userId) return;

        const message = {
            from: userId,
            to: friend._id,
            content: messageInput,
            timestamp: new Date(),
        };

        // Add message to local state immediately for UI responsiveness
        setMessages((prevMessages) => [...prevMessages, message]);

        // Send message through socket
        socket.emit('sendMessage', { userId: friend._id, message });

        // Clear input
        setMessageInput('');

        // Refresh message history to ensure DB consistency
        fetchMessageHistory(friend._id);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="chat-room flex flex-col w-[100vw] h-[100vh] justify-between">
            <div className="chat-header p-4 border-b border-gray-800">
                <h2 className='text-xl'>{friend ? friend.name : 'No Friend Selected'}</h2>
            </div>
            {friend ? (
                <div className="chat-messages flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <p className='text-gray-500'>Loading messages...</p>
                    ) : error === 'No message found' ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <h3 className="text-2xl font-semibold mb-2">Say Hi 👋</h3>
                                <p className="text-gray-500">Start a conversation with {friend.name}</p>
                            </div>
                        </div>
                    ) : (
                        messageHistory.length > 0 ? (
                            messageHistory.map((message, index) => (
                                <div key={index} className={`message ${message.sender === friend._id ? 'text-right' : 'text-left'}`}>
                                    <p className='text-gray-700'>{message.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className='text-gray-500'>No messages yet</p>
                        )
                    )}
                </div>
            ) : (
                <div className="chat-messages flex-1 flex items-center justify-center">
                    <p className='text-gray-500'>Select a friend to start chatting</p>
                </div>
            )}
            <div className="chat-input flex p-4 items-center border-t border-gray-800">
                <div className="msg-area w-full flex items-center px-3">
                    <Input
                        type="text"
                        placeholder="Type a message..."
                        className="w-full px-3 py-2"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={!friend._id || !isConnected}
                    />
                    <Send
                        className="text-gray-500 cursor-pointer ml-2"
                        size={24}
                        onClick={sendMessage}
                    />
                </div>
            </div>
        </div>
    )
}
