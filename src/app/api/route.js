import { connectDB } from "@/lib/db";  // Use the correct import path

export async function GET(req) {
    await connectDB();
    return Response.json({ message: "Database Connected" });
}
