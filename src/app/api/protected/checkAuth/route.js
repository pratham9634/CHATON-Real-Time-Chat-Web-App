import User from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db"; // Ensure database is connected

export async function GET(req) {
    try {
        await connectDB(); // ✅ Connect to DB first

        // ✅ Await cookies() before using
        const userCookies = await cookies(); 
        const token = userCookies.get("jwt")?.value;

        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { 
                status: 401, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        // ✅ Verify and decode token safely
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded); // Debugging
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            return new Response(JSON.stringify({ error: "Invalid Token" }), { 
                status: 401, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        if (!decoded?.userId) {
            return new Response(JSON.stringify({ error: "Invalid Token Data" }), { 
                status: 401, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        // ✅ Fetch user safely
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { 
                status: 404, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        return new Response(JSON.stringify({ user }), { 
            status: 200, 
            headers: { "Content-Type": "application/json" } 
        });

    } catch (error) {
        console.error("Server Error:", error.message);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    }
}
