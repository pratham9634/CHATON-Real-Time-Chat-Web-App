"use client";

import Link from "next/link";
import useAuthStore  from "@/store/useAuthStore"; // Ensure correct store import
import {useThemeStore}  from "@/store/useThemeStore";
import { LogOut, MessagesSquare, Moon, Settings, Sun, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const {theme,setTheme} = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === "black" ? "light" : "black");
  };
  return (
    <header data-theme={theme}
      className=" border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container px-4 h-14">
        <div className="flex items-center w-screen  justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <MessagesSquare className="w-5 h-5 text-amber-500" />
              </div>
              <h1 className="text-lg font-bold">ChatOn</h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center mr-10 gap-2">
          <button 
          onClick={toggleTheme}
          className="btn btn-sm gap-2 rounded-xl p-4 transition-colors"
          >
            {theme === "light" ?<Moon/>:<Sun/>}
            <span className="sm:inline">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>

            {authUser && (
              <>
                <Link href="/profile" className="btn btn-sm rounded-xl gap-2">
                  <User className="size-5" />
                  <span className="hidden  sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
