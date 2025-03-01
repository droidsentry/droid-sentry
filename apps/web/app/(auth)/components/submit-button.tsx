"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="outline"
      disabled={pending}
      className={cn("w-full", className)}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          ログイン中...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
