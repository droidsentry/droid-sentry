"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export default function PasswordWithResetForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  form,
  name,
  autoComplete,
  label = "パスワード",
}: {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  autoComplete: "new-password" | "current-password";
  label?: string;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            <Button
              variant="link"
              className="text-xs p-0 text-muted-foreground hover:text-primary"
              asChild
            >
              <Link href="/password-reset">パスワードをお忘れですか？</Link>
            </Button>
          </div>
          <FormControl>
            {/* FormControl コンポーネントには単一の子要素（div）のみを渡すようにする */}
            <div className="relative">
              <Input
                type={passwordVisible ? "text" : "password"}
                autoComplete={autoComplete}
                placeholder=""
                minLength={8}
                className="pr-10"
                {...field}
              />
              <Button
                size="icon"
                type="button"
                className="absolute top-0 right-0"
                variant="ghost"
                onClick={() => setPasswordVisible((v) => !v)}
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                <span className="sr-only">
                  {passwordVisible ? "パスワードを隠す" : "パスワードを表示"}
                </span>
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
