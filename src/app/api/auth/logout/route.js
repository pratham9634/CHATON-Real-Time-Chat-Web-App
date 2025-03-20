import { cookies } from "next/headers";

export async function POST(req) {
try {
    const userCookies = await cookies(); // ✅ Call before using
    userCookies.set("jwt", "", {
        httpOnly: true,
        maxAge: 0,
        path: "/",
    });
    return Response.json({message: "user logout" }, { status: 201 });
} catch (error) {
    console.error(error.message);
    return Response.json({ error: "Internal Server Error" }, { status:500 });
}
};