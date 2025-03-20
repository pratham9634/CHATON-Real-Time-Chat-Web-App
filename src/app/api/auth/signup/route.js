import { connectDB } from "@/lib/db";
import { generateToken } from "@/lib/utils";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { fullName, email, password } = await req.json();

    if (!password|| !email||!fullName) {
        return Response.json({ error: "All fields are required" }, { status: 400 });
    }
    //check for password length should br greater than 6
    if (password.length < 6) {
        return Response.json({ error: "password should br greater than or equal to 6 " }, { status: 400 });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ fullName, email, password: hashedPassword });
   if(newUser){
    generateToken(newUser._id);
    await newUser.save();
   }
    
    return Response.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
