import mongoose from 'mongoose';
import Message from '@/models/message';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import { connectDB } from '@/lib/db';

  export async function GET(req,{ params }){
    try {
        await connectDB(); // Ensure DB connection is established
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;
        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const myId = decoded.userId;
        const { id:userToChatId } = await params;

        if (!userToChatId) {
            return Response.json({ error: "Invalid user ID" }, { status: 400 });
        }

        // Ensure both IDs are valid MongoDB ObjectIds
        if (!mongoose.Types.ObjectId.isValid(myId) || !mongoose.Types.ObjectId.isValid(userToChatId)) {
            return Response.json({ error: "Invalid user ID format" }, { status: 400 });
        }

        // Fetch messages
        const messages = await Message.find({
            $or: [{ senderId: myId, receiverId: userToChatId }, { senderId:userToChatId , receiverId: myId }],
        });
        return Response.json(messages, { status: 200 });

    }catch(error){
        console.log("error in usersChatRoute :",error.message);
        return Response.json({ error: "Internal server error" }, { status: 501 });
    }    
};