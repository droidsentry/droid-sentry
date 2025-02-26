"use client";

import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { useChangeLocale, useCurrentLocale } from "@/locales/client";

export function LocaleToggle({ className }: { className?: string }) {
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();
  return (
    <Toggle
      // variant="outline"
      aria-label="Toggle bold"
      className={cn("rounded-full uppercase", className)}
      onClick={() => changeLocale(locale === "en" ? "ja" : "en")}
    >
      <span
        className={cn(
          "text-muted-foreground text-lg",
          locale === "ja" && "text-primary"
        )}
      >
        JA
      </span>
      <Separator orientation="vertical" className="h-4 mx-1" />
      <span
        className={cn(
          "text-muted-foreground text-lg",
          locale === "en" && "text-primary"
        )}
      >
        EN
      </span>
    </Toggle>
  );
}
