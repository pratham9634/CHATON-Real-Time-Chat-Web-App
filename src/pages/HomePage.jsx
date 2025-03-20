import React from 'react'
import {useThemeStore}  from "@/store/useThemeStore";
import useChatStore from '@/store/useChatStore';
import Sidebar from '@/components/Sidebar';
import NoChatSelected from '@/components/NoChatSelected';
import ChatContainer from '@/components/ChatContainer';


const HomePage = () => {
  const { theme } = useThemeStore();
  const { selectedUser } = useChatStore();
  return (
    <div className="h-screen bg-base-200" data-theme={theme}>
      <div className="flex items-center justify-center pt-15 px-2">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-12xl h-[calc(100vh-5rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
