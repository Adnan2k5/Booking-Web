import React, { useEffect } from 'react'
import { ChatArea } from './ChatArea'
import { useFriend } from '../../hooks/useFriend';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';

export const ChatLayout = () => {
    const { friends, fetchFriends } = useFriend();
    useEffect(() => {
        fetchFriends();
    }, []);
    const [selectedFriend, setSelectedFriend] = React.useState(null);
    return (
        <div className='min-h-screen w-screen overflow-y-hidden flex'>
            <div className="sidebar border-r  border-gray-800 min-w-[300px]">
                <div className="sidebar-header border-b p-4 border-gray-800 text-center">
                    <h2 className='text-xl'>Adventure Social</h2>
                </div>
                <div className='p-4 flex items-center justify-between border-b border-gray-800 text-center'>
                    <h2 className='text-xl text-left'>Friends</h2>
                    {selectedFriend && <p onClick={() => { setSelectedFriend(null) }} className='px-2 cursor-pointer  py-1 text-sm bg-black text-white rounded-4xl'>Close Chat</p>}
                </div>
                <div className='flex-1 overflow-y-auto '>
                    {friends.map(friend => (
                        <div key={friend._id} onClick={() => { setSelectedFriend(friend) }} className='p-4 flex gap-5 hover:bg-gray-700 cursor-pointer'>
                            <Avatar src={friend.profilePicture} alt={friend.name} className='w-12 h-12'>
                                <AvatarFallback className='w-12 h-12 bg-gray-600 text-white'>
                                    {friend.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="dtls">
                                <h3 className='text-lg font-semibold'>{friend.name}</h3>
                                <p className='text-sm text-gray-400'>{friend.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* / Chat Area */}
            <ChatArea selectedFriend={selectedFriend} />
        </div>
    )
}
