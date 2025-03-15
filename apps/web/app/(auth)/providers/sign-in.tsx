"use client";

import { signInSchema } from "@/app/schemas/auth";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import {
  ZodTooBigIssue,
  ZodTooSmallIssue,
  ZodIssueOptionalMessage,
  z,
} from "zod";

export type SignIn = z.infer<typeof signInSchema>;

export function SignInFormProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("auth.signIn");
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(signInSchema, {
      errorMap: (issue, ctx) => {
        switch (issue.path[0] as keyof SignIn) {
          case "emailOrUsername":
            if (issue.code === "too_small") {
              return { message: t("tooSmallEmailOrUsername") };
            }
            if (issue.code === "too_big") {
              return {
                message: t("tooBigEmailOrUsername", {
                  maximum: String(issue.maximum),
                }),
              };
            }
            break;
          case "password":
            if (issue.code === "too_small") {
              return {
                message: t("tooSmallPassword", {
                  minimum: String(issue.minimum),
                }),
              };
            }
            if (issue.code === "custom") {
              return { message: t("customInvalidPassword") };
            }
            break;
        }
        return { message: ctx.defaultError };

        // console.log("passwordResetSchema", issue, ctx);
        //   const path = issue.path.join(".");
        //   const minimum = "minimum" in issue && String(issue.minimum);
        //   const maximum = "maximum" in issue && String(issue.maximum);
        //   const messageMap = {
        //     emailOrUsername: {
        //       too_small: t("tooSmallEmailOrUsername"),
        //       too_big: t("tooBigEmailOrUsername", { maximum }),
        //     },
        //     password: {
        //       too_small: t("tooSmallPassword", { minimum }),
        //       custom: t("customInvalidPassword"),
        //     },
        //   };
        //   const pathMessages = messageMap[path];
        //   const message = pathMessages ? pathMessages[issue.code] : undefined;
        //   return { message: message || ctx.defaultError };
      },
    }),
    defaultValues: {
      emailOrUsername: process.env.NEXT_PUBLIC_DEV_EMAIL ?? "",
      password: process.env.NEXT_PUBLIC_DEV_PASSWORD ?? "",
    },
  });

  return <Form {...form}>{children}</Form>;
}
