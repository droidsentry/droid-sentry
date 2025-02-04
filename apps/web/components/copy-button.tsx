"use client";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const iconBaseClass =
    "transition scale-0 duration-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1500);
        });
      }}
      className={cn(
        "border relative rounded-md w-8 h-8 grid place-content-center bg-muted text-muted-foreground",
        className
      )}
    >
      <Check
        size={16}
        className={cn(iconBaseClass, copied ? "scale-1" : "scale-0 opacity-0")}
      />
      <Copy
        size={16}
        className={cn(iconBaseClass, copied ? "scale-0 opacity-0" : "scale-1")}
      />
      <span className="sr-only">コピー</span>
    </button>
  );
}
