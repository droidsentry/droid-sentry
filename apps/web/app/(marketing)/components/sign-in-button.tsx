"use client";

import { Button } from "@/components/ui/button";
import { Loader2, LogIn } from "lucide-react";

import { useRouter } from "next/navigation";

import { useState } from "react";

export default function SingInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    setIsLoading(true);
    router.replace("/sign-in"); // replaceを使用することで<Link replace>と同等の動作になります
  };

  return (
    <Button
      variant="outline"
      className={` border-2 rounded-full border-primary ml-4 px-6 py-3.5 h-[52px]`}
      disabled={isLoading}
      onClick={handleSignIn}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          <span className="hidden sm:block text-16 font-medium">
            サインイン中...
          </span>
        </>
      ) : (
        // <>サインイン</>
        <span className="text-base">Login</span>
      )}
    </Button>
  );
}
