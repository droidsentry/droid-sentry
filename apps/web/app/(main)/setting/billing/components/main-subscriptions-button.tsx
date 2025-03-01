"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function MainSubscriptionButton({
  className,
  isLoading,
}: {
  className?: string;
  isLoading?: boolean;
}) {
  const form = useFormContext();
  const isValid = form.formState.isValid; // バリデーションエラー
  const isPending = form.formState.isValidating; // バリデーション中
  // const isLoading = status.pending || form.formState.isSubmitting; // ローディング中
  const isDisabled =
    !isValid || // バリデーションエラー
    isPending || // バリデーション中
    isLoading; // ローディング中

  return (
    <Button
      disabled={isDisabled}
      className={cn(
        "w-full rounded-full bg-blue-600 font-bold text-white px-6 hover:bg-blue-500 transition-colors",
        "w-fit tracking-widest",
        className
      )}
    >
      {isDisabled ? (
        <>
          <Loader2 className="size-4 animate-spin" />
        </>
      ) : (
        <span>購入</span>
      )}
    </Button>
  );
}
