import mongoose from 'mongoose';
import Message from '@/models/message';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";
import cloudinary from '@/lib/cloudinary';
import { getReceiverSocketId, io } from '@/server';



export async function POST(req, { params }) {
    try {
        // Get the JWT token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;

        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const senderId = decoded.userId;

        // Get receiver ID from params
        const { id: receiverId } = await params; 

        // Parse request body
        const { text, image } = await req.json(); // ✅ Parse JSON body correctly

        let imageUrl;
        if (image) {
            const upload = await cloudinary.uploader.upload(image);
            imageUrl = upload.secure_url;
        }

        // Create and save the message
        const message = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        const result = await message.save();
        setTimeout(() => {
            console.log("Checking getReceiverSocketId after delay:", getReceiverSocketId(userId));
            const receiverSocketId = getReceiverSocketId(receiverId);
        }, 500);
        
        
        console.log(" Receiver socket ID :", receiverSocketId);
if (receiverSocketId) {
    console.log("✅ Receiver socket ID found:", receiverSocketId);
    io.to(receiverSocketId).emit("newMessage", result);
} else {
    console.log("❌ Receiver is not connected. No socket ID found.");
}


        return Response.json(result);
    } catch (error) { // ✅ Pass error to catch
        console.log("Error in sendChatRoute:", error.message);
        return Response.json({ error: "Internal server error" }, { status: 501 });
    }
};
