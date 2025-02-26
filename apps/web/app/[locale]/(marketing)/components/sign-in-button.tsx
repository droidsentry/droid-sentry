"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";

import { useState } from "react";

export default function SingInButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const scopedT = useScopedI18n("signIn");

  const handleSignIn = () => {
    setIsLoading(true);
    router.replace("/sign-in");
  };

  return (
    <Button
      variant="outline"
      className={cn(
        `border-2 rounded-full ml-4 px-6 py-3.5 h-[52px]`,
        className
      )}
      disabled={isLoading}
      onClick={handleSignIn}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          <span className="hidden sm:block text-16 font-medium">
            {scopedT("signingIn")}
          </span>
        </>
      ) : (
        <span className="text-base">{scopedT("signIn")}</span>
      )}
    </Button>
  );
}
