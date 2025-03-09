import * as React from "react";
import { InfoIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface InfoPopoverProps {
  content: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function InfoPopover({
  content,
  className,
  side = "top",
  align = "center",
}: InfoPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={` rounded-lg p-0 ${className} flex-shrink-0 m-0 p-0 size-6`}
          aria-label="情報を表示"
        >
          <InfoIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side={side} align={align} className="max-w-sm text-sm">
        {content}
      </PopoverContent>
    </Popover>
  );
}
