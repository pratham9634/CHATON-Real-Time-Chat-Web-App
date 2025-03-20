import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/utils";
import User from "@/models/user";

export async function middleware(req){
    const token = req.cookie.get("jwt")?.value;

    if(!token){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    console.log(decoded);
    if(!decoded){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
        return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    req.user = user;
    return NextResponse.next();
};
export const config = {
    matcher: ["/api/protected/:path*"], // Protect specific API routes
};