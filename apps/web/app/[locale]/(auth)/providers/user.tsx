"use client";

import { emailOrUsernameSchema } from "@/app/schema/auth";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm, useFormContext } from "react-hook-form";

export function UserProvider({ children }: { children: ReactNode }) {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(emailOrUsernameSchema),
    defaultValues: {
      emailOrUserName: process.env.NEXT_PUBLIC_DEV_EMAIL ?? "",
      password: process.env.NEXT_PUBLIC_DEV_PASSWORD ?? "",
    },
  });

  return <Form {...form}>{children}</Form>;
}

/**
 * 入力中のユーザー名orパスワードをリセット画面などで引き継ぐ際に使用
 * password-reset-verify-form.tsx で使用
 * password-update-form.tsx で使用
 */
export const useEmailOrUsername = () => {
  const form = useFormContext();
  return form.getValues("emailOrUserName");
};
