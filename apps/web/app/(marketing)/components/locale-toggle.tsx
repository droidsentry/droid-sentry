"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { setUserLocale } from "@/i18n/locale";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

export function LocaleToggle({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <Button
      variant="ghost"
      aria-label="Toggle bold"
      className={cn(" group rounded-full uppercase", className)}
      onClick={async () => {
        await setUserLocale(locale === "en" ? "ja" : "en");
      }}
    >
      <span
        className={cn(
          "text-muted-foreground text-lg",
          locale === "ja" && "text-primary"
        )}
      >
        JA
      </span>
      <Separator
        orientation="vertical"
        className="h-4 mx-1 group-hover:bg-muted-foreground"
      />
      <span
        className={cn(
          "text-muted-foreground text-lg",
          locale === "en" && "text-primary"
        )}
      >
        EN
      </span>
    </Button>
  );
}
