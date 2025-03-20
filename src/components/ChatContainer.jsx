import useChatStore from '@/store/useChatStore'
import React, { useEffect, useRef } from 'react'
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';
import MessageInput from './MessageInput';
import { formatMessageTime } from '@/lib/utils';
import useAuthStore from '@/store/useAuthStore';

const ChatContainer = () => {
  const {messages,getMessages,isMessageLoading,selectedUser,subscribeToMessage,unsubscribeFromMessage} = useChatStore();
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    console.log("Selected User:", selectedUser); 
      getMessages(selectedUser._id);
      
      subscribeToMessage();
      return ()=>{
        unsubscribeFromMessage();
      }
  }, [getMessages, selectedUser._id,subscribeToMessage,unsubscribeFromMessage]);
  useEffect(() => {
    if(messageEndRef.current && messages)
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  },[messages]);
 
  if(isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col w-screen overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId.toString() === authUser._id.toString() ? "chat-end" : "chat-start"}`}

            
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "https://github.com/burakorkmez/fullstack-chat-app/blob/master/frontend/public/avatar.png?raw=true"
                      : selectedUser.profilePic || "https://github.com/burakorkmez/fullstack-chat-app/blob/master/frontend/public/avatar.png?raw=true"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
             <span className='text-rose-700'> {`${message.senderId.toString() === authUser._id.toString() ? "You " : ""}`}</span>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer
