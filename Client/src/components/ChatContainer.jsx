import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { Loader } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = () => {
  const {messages,getMessages,isMessagesLoading,selectedUser,subscribeToMessages,unsubscribeFromMessages} = useChatStore();
  const {authUser} = useAuthStore();
  const messageEnd = useRef(null);

  useEffect(()=>{
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  },[selectedUser._id,getMessages]);

  useEffect(()=>{
    if(messageEnd.current && messages) {
      messageEnd.current.scrollIntoView({behavior:"smooth"});
    }
  },[messages])

  if(isMessagesLoading) return 
  <div className='flex flex-col overflow-auto'>
      <ChatHeader/>
      <Loader/>
      <MessageInput/>
  </div>

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>

      <div className='flex-1 overflow-y-auto p-4 spacey-4'>
          {messages.map((message)=>(
            <div key= {message._id} className={`chat ${message.senderId === authUser._id?"chat-end":"chat-start"}`} ref={messageEnd}>
              <div className='chat-image avatar'>
                <div className='size-10 rounded-full border'>
                    <img src={message.senderId ==- authUser._id 
                    ? authUser.profilePic ||"/avatar.avif"
                    : selectedUser.profilePic || "/avatar.avif"} 
                    alt="Profile" />

                </div>
              </div>
              <div className='chat-header mb-1'>
                  <time className='text-sm opacity-50 ml-1'>
                    {formatMessageTime(message.createdAt)}
                  </time>
              </div>
              <div className='chat-bubble flex flex-col'>
                      {message.image && (
                        <img src={message.image} alt="Image" className='sm:max-w-[200px] rounded-md mb-2'/>
                      )}
                      {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))}
      </div>

      <MessageInput/>
    </div>
  )
}

export default ChatContainer