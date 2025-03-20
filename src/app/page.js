'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import HomePage from "@/pages/HomePage";
import { Loader } from "lucide-react";

export default function Page() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  if (!authUser) {
    router.push("/login");
  }

  return <HomePage/>;
}
