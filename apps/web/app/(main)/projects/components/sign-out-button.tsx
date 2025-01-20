"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SignOutButton({ className }: { className?: string }) {
  const status = useFormStatus();
  return (
    <Button
      variant="ghost"
      className={cn("gap-2 w-full justify-start px-3 py-1 h-8", className)}
    >
      {status.pending ? (
        <>
          <Loader2Icon size={20} />
          <span>サインアウト中...</span>
        </>
      ) : (
        <>
          <LogOutIcon size={20} className="" />
          <span>サインアウト</span>
        </>
      )}
    </Button>
  );
}
