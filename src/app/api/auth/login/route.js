import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        await connectDB(); // Ensure DB connection before querying

        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({ error: "Invalid Credentials" }, { status: 401 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return Response.json({ error: "Invalid Credentials" }, { status: 401 });
        }

        const token = generateToken(user._id);
        const userCookies = await cookies(); // ✅ Call before using
         userCookies.set("jwt", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return Response.json({ message: "Login successful", user }, { status: 200 });
    } catch (error) {
        console.log("Error:", error.message);
        return Response.json({ error: "Server Error" }, { status: 500 });
    }
}
