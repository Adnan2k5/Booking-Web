import { useMessage } from '../../hooks/useMessage';
import { Input } from '../../components/ui/input';
import { Send } from 'lucide-react';
import React, { useEffect } from 'react'

export const ChatArea = ({ selectedFriend }) => {
    const friend = selectedFriend || { name: 'No Friend Selected' };
    const { messageHistory, loading, error, fetchMessageHistory } = useMessage();

    useEffect(() => {
        if (friend._id !== undefined) {
            fetchMessageHistory(friend._id);
        }
    }, [friend._id]);

    return (
        <div className="chat-room flex flex-col w-[100vw] h-[100vh]  justify-between">
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
                <div className="msg-area  w-full flex items-center px-3">
                    <Input type="text" placeholder="Type a message..." className="w-full px-3 py-2" />
                    <Send className="text-gray-500 cursor-pointer ml-2" size={24} />
                </div>
            </div>
        </div>
    )
}
