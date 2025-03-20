import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import { cookies } from 'next/headers';


export async function GET(req){
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("jwt")?.value;

        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");
        return Response.json(filteredUsers);
    }catch(error){
        console.log("error:",error.message);
        return Response.json({ error: "Internal server error" }, { status: 501 });
    }    
};