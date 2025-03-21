import { io } from 'socket.io-client';
import { create } from 'zustand';
import axiosInstance from 'axios';
import toast from 'react-hot-toast';


const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    isLoggingIn: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const result = await axiosInstance.get('/api/protected/checkAuth'); // ✅ Fixed API route
            set({ authUser: result.data.user || null });
            get().connectSocket();
        } catch (error) {
            console.log("Auth check failed:", error.message);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup : async(data)=>{
        set({ isSigningUp: true });
        try{
            const result = await axiosInstance.post('/api/auth/signup',data);
            set({ authUser: result.data.user  });
            toast.success("Account created successfully");

            get().connectSocket();
        }catch(error){
            console.log("Error signing up :",error.message);
            set({ authUser: null });
        }finally{
            set({isSigningUp:false})
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/api/auth/login", data);
          set({ authUser: res.data });
          toast.success("Logged in successfully");
          get().connectSocket();
        } catch (error) {
          console.log(error.message)
        } finally {
          set({ isLoggingIn: false });
        }
      },
    
      logout: async () => {
        try {
          await axiosInstance.post("/api/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          get().disconnectSocket();
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error(error.message || "Something went wrong!");
          }
          
      },
      updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/api/protected/update_profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      connectSocket : ()=>{
        const {authUser} = get();
        if (!authUser || get().socket?.connected) return;
        const socket= io("wss://socket-server-63lj.onrender.com", { 
          transports: ["websocket", "polling"],
        query:{
          userId: authUser._id,
        },
        withCredentials:true,
       });
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
        
      },
      disconnectSocket : ()=>{
        if (get().socket?.connected) get().socket.disconnect();
      },


}));

export default useAuthStore;
