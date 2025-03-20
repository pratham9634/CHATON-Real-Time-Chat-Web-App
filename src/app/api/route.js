import { connectDb } from "@/lib/db";  // Use the correct import path

export async function GET(req) {
    await connectDb();
    return Response.json({ message: "Database Connected" });
}
