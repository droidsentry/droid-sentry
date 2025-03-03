"use client";

import { passwordResetSchema } from "@/app/schema/auth";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";

export function UserProvider({ children }: { children: ReactNode }) {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      emailOrUserName: process.env.NEXT_PUBLIC_DEV_EMAIL ?? "",
      password: process.env.NEXT_PUBLIC_DEV_PASSWORD ?? "",
    },
  });

  return <Form {...form}>{children}</Form>;
}
