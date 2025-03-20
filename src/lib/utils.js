import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET ; // Use environment variable

// Generate JWT Token
export const generateToken = (userId) => {
    const token = jwt.sign({userId}, SECRET_KEY, {
        expiresIn: "7d", // Token expires in 7 days
    });
    return token;
};

// Verify JWT Token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};
export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
