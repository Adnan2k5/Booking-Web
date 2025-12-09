import React, { useEffect, useState } from 'react'
import { ChatArea } from './ChatArea'
import { useSenders } from '../../hooks/useSenders';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { motion } from 'framer-motion';
import { Search, Users, MessageCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const ChatLayout = () => {
    const { senders, fetchSenders } = useSenders();
    // Map senders to the same `friend` shape this component expects

    const friends = (senders || []).map(s => ({
        _id: s._id,
        name: s.user?.name || s.hotel?.name || 'Unknown',
        email: s.user?.email || '',
        profilePicture: s.user?.profilePicture || '',
        latestMessage: s.latestMessage,
        unreadCount: s.unreadCount || 0,
        hotelName: s.hotel?.name || null
    }));

    console.log('Mapped friends:', friends);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        fetchSenders();

        // Hide sidebar on mobile by default
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            } else {
                setShowSidebar(true);
            }
        };

        // Initial check
        handleResize();

        // Listen for window resize events
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle chat query parameter to auto-select a friend
    useEffect(() => {
        const chatUserId = searchParams.get('chat');
        if (chatUserId && friends.length > 0) {
            const friend = friends.find(f => f._id === chatUserId);
            if (friend) {
                setSelectedFriend(friend);
                // On mobile, show chat area and hide sidebar
                if (window.innerWidth < 768) {
                    setShowSidebar(false);
                }
            }
        }
    }, [searchParams, friends]);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleCloseChatClick = () => {
        setSelectedFriend(null);
        if (window.innerWidth < 768) {
            setShowSidebar(false);
        }
    };

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='h-full w-full flex relative'>
            {/* Sidebar */}
            <motion.div
                className={`sidebar md:min-w-[320px] w-full md:w-[320px] md:relative absolute z-10 h-full flex flex-col bg-white border-r border-gray-100 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]`}
                initial={{ x: typeof window !== 'undefined' && window.innerWidth < 768 ? -320 : 0 }}
                animate={{ x: showSidebar ? 0 : -320 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ maxWidth: '100%' }}
            >
                <div className="sidebar-header p-2 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                            <MessageCircle size={20} className="text-white" />
                        </div>
                        <h2 className='text-xl font-bold text-black'>
                            Adventure Social
                        </h2>
                    </div>
                </div>

                <div className='p-2 flex items-center justify-between border-b border-gray-100 bg-white/50 backdrop-blur-sm'>
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-black" />
                        <h2 className='text-lg font-medium text-gray-800'>Friends</h2>
                    </div>
                </div>

                {/* Search input */}
                <div className="p-2 border-b border-gray-100 bg-white/30">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search friends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2.5 pl-10 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
                        />
                        <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto'>
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map(friend => (
                            <motion.div
                                key={friend._id}
                                onClick={() => {
                                    setSelectedFriend(friend);
                                    if (window.innerWidth < 768) setShowSidebar(false);
                                }}
                                className={`p-2 flex gap-2 items-center cursor-pointer transition-all hover:bg-gray-50/80 ${selectedFriend?._id === friend._id ? 'bg-gray-50 border-l-4 border-gray-900 pl-1.5' : 'border-l-4 border-transparent'}`}
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Avatar className='w-8 h-8 border border-gray-100 shadow-sm'>
                                    <AvatarImage src={friend.profilePicture} alt={friend.name} />
                                    <AvatarFallback className='w-8 h-8 bg-gray-900 text-white font-medium text-xs'>
                                        {friend.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h3 className='text-base font-semibold text-gray-800'>{friend.name}</h3>
                                    <p className='text-sm text-gray-500 truncate'>{friend.hotelName ? friend.hotelName : friend.email}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-gray-500 bg-white/30 m-4 rounded-lg">
                            {searchQuery ? "No friends match your search" : "No friends found"}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Chat Area */}
            <div className="flex-1 w-full h-full">
                <ChatArea
                    selectedFriend={selectedFriend}
                    toggleSidebar={toggleSidebar}
                    onClose={handleCloseChatClick}
                />
            </div>
        </div>
    )
}
