"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function OptionSubscriptionButton({
  className,
}: {
  className?: string;
}) {
  const status = useFormStatus();
  return (
    <Button
      variant="outline"
      className={cn(
        "w-full rounded-md text-blue-600 font-bold px-6 border-blue-600 hover:bg-blue-600 hover:text-white",
        "w-fit tracking-widest",
        className
      )}
    >
      {status.pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          処理中...
        </>
      ) : (
        <span>利用開始</span>
      )}
    </Button>
  );
}
