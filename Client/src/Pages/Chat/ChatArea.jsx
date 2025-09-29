import { useMessage } from '../../hooks/useMessage';
import React, { useEffect, useState, useRef } from 'react'
import { io } from "socket.io-client";
import { useAuth } from '../AuthProvider';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { formatMessage, isMessageFromUser } from '../../utils/chatHelpers';
import { SOCKET_URL, SOCKET_CONFIG, EMPTY_STATES } from '../../constants/chatConstants';
import { uploadFile, isImageFile, debugFileUpload } from '../../utils/fileUploadUtils';
import MessageBubble from './components/MessageBubble';
import AttachmentPanel from './components/AttachmentPanel';
import EmptyState from './components/EmptyState';
import MessageInput from './components/MessageInput';
import BackgroundEffects from './components/BackgroundEffects';
import ChatHeader from './components/ChatHeader';
import MessageContainer from './components/MessageContainer';

// Create socket outside component to prevent multiple connections
const socket = io(SOCKET_URL, SOCKET_CONFIG);

export const ChatArea = ({ selectedFriend, toggleSidebar, onClose }) => {
    const friend = selectedFriend || { name: 'No Friend Selected' };
    const { user } = useAuth();
    const { messageHistory, loading, error, fetchMessageHistory } = useMessage();
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const messageEndRef = useRef(null);

    const userId = user?.user?._id;

    // Connect to socket when component mounts
    useEffect(() => {
        if (userId) {
            // Connect to socket server
            socket.connect();

            // Set up event listeners
            socket.on('connect', () => {
                setIsConnected(true);
                socket.emit('joinRoom', { userId });
            });

            socket.on('disconnect', () => {
                setIsConnected(false);
            });

            socket.on('receiveMessage', (message) => {

                // Format the received message to match our local format
                const formattedMessage = formatMessage(message);

                setMessages((prevMessages) => [...prevMessages, formattedMessage]);
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

    // Scroll to bottom when messages change
    useEffect(() => {
        // Use requestAnimationFrame to ensure DOM is updated before scrolling
        requestAnimationFrame(() => {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        });
    }, [messageHistory, messages]);

    // Update messages state when messageHistory changes
    useEffect(() => {
        if (messageHistory.length > 0) {
            // Map the messages to a consistent format
            const formattedMessages = messageHistory.map(msg => formatMessage(msg));

            setMessages(formattedMessages);
        }
    }, [messageHistory]);

    const handleSendMessage = async (text, attachments = []) => {
        if ((!text.trim() && attachments.length === 0) || !friend._id || !userId) return;

        // Create base message using the properties expected by the backend (from/to)
        const message = {
            from: userId,
            to: friend._id,
            content: text,
            timestamp: new Date(),
        };

        // Create a local copy for display with the sender/receiver pattern
        const localMessage = {
            sender: userId,
            receiver: friend._id,
            content: text,
            timestamp: new Date(),
        };

        // If there are attachments, add them to the message
        if (attachments && attachments.length > 0) {
            localMessage.attachments = attachments;
            message.attachments = attachments;
        }

        // Add message to local state immediately for UI responsiveness
        setMessages((prevMessages) => [...prevMessages, localMessage]);

        // Send message through socket (without waiting for response)
        try {
            socket.emit('sendMessage', { userId: friend._id, message });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleCloseChat = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <BackgroundEffects>
            <motion.div
                className="chat-room flex flex-col w-full h-[100vh] justify-between relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <ChatHeader
                    friend={friend}
                    toggleSidebar={toggleSidebar}
                    onClose={handleCloseChat}
                />

                {friend?._id ? (
                    <div className="chat-messages w-full flex-1 overflow-y-auto flex flex-col-reverse scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <MessageContainer
                            messages={messages}
                            loading={loading}
                            error={error}
                            userId={userId}
                            user={user}
                            friend={friend}
                            messageEndRef={messageEndRef}
                        />
                    </div>
                ) : (
                    <div className="chat-messages flex-1 flex items-center justify-center">
                        <EmptyState
                            title={EMPTY_STATES.NO_FRIEND_SELECTED.title}
                        />
                    </div>
                )}

                {/* Message input component */}
                {friend?._id && (
                    <div className="p-3 backdrop-blur-sm bg-white/70 border-t border-gray-200 rounded-b-xl">
                        <MessageInput onSendMessage={handleSendMessage} />
                    </div>
                )}
            </motion.div>
        </BackgroundEffects>
    )
}
