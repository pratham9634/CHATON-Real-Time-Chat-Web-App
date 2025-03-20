
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ChatOn",
  description: "Real time web chat application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
       <body
                        data-new-gr-c-s-check-loaded="14.1096.0"
                        data-gr-ext-installed=""
                        cz-shortcut-listen="true"
        >
        <Navbar/>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
