import { create } from 'zustand';
import axiosInstance from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from './useAuthStore';

const useChatStore = create((set,get)=>({
    messages: [],
    selectedUser:null,
    users:[],
    isUserLoading:false,
    isMessageLoading:false,

    getUsers: async()=>{
        set({isUserLoading:true});
        try {
            const res = await axiosInstance.get('/api/protected/users');
            set({users:res.data});
        } catch (error) {
            console.log("Error get users :",error.message);
            toast.error(error.message);
        }finally{
            set({isUserLoading:false});
        }
    },
    getMessages:async(userId)=>{
        set({isMessageLoading:true});
        try {
            const res = await axiosInstance.get(`/api/protected/${userId}`);
            set({messages:res.data});
        } catch (error) {
            console.log("Error get messages:",error.message);
            toast.error(error.message);
        }finally{
            set({isMessageLoading:false});
        }

    },
    sendMessage:async(messageData)=>{
        const {messages , selectedUser}=get();
        try {
            const res = await axiosInstance.post(`/api/protected/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]});
        } catch (error) {
            console.log("Error send messages:",error.message);
            toast.error(error.message);
        }
    },


    setSelectedUser : (selectedUser)=>{
        set({selectedUser});
    },
    subscribeToMessage : ()=>{
        const {selectedUser}=get();
        if(!selectedUser)return;
        
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(result)=>{
            const isMessageSentFromSelectedUser = result.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            console.log("New message received:", result);
            set({ messages: [...get().messages, result], }); 
        });
    },
    unsubscribeFromMessage : ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}));
export default useChatStore;