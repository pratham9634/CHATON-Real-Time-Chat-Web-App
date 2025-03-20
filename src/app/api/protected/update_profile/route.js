import cloudinary from "@/lib/cloudinary";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PUT(req) {
    try {
        const token = cookies().get("jwt")?.value;

        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const { profilePic, description } = await req.json(); // Extract body data

        let updatedUser;

        if (profilePic) {
            const uploadResult = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: uploadResult.secure_url },
                { new: true }
            );
        }

        if (description) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { description },
                { new: true }
            );
        }

        return Response.json({ message: "Updated User", user: updatedUser }, { status: 201 });
    } catch (error) {
        console.error("Error:", error.message);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
