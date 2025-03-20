'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import LoginPage from "@/pages/LoginPage";

export default function Page() {
  const { authUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (authUser) {
      router.push("/");
    }
  }, [authUser, router]);

  return <LoginPage />;
};
