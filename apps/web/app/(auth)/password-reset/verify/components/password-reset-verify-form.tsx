"use client";

import { resetPasswordVerify } from "@/actions/auth/auth-supabase";
import { passwordResetVerifySchema } from "@/app/schema/auth";
import { PasswordResetVerify, SignIn } from "@/app/types/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function PasswordResetVerifyForm() {
  const emailOrUsername = useFormContext<SignIn>().getValues("emailOrUsername");
  const router = useRouter();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(passwordResetVerifySchema),
    defaultValues: {
      pin: "",
      email: emailOrUsername,
    },
  });

  const onSubmit = async (formData: PasswordResetVerify) => {
    await resetPasswordVerify(formData)
      .then(() => {
        toast.success("パスワードを更新しました。");
        router.push("/password-update");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center py-3 text-xl sm:text-2xl">
            パスワードリセット
          </CardTitle>
          <div className="mb-8 text-center text-lg sm:text-xl pb-4">
            {emailOrUsername}
          </div>
          <CardDescription className="mb-8 text-center text-xs sm:text-sm">
            登録済みのメールアドレスにパスワードリセットの
            <br />
            認証コードを送信しました。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 pb-2"
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center gap-4">
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="rounded-r-md" />
                          <InputOTPSlot
                            index={1}
                            className="rounded-md border"
                          />
                          <InputOTPSlot
                            index={2}
                            className="rounded-md border"
                          />
                          <InputOTPSlot
                            index={3}
                            className="rounded-md border"
                          />
                          <InputOTPSlot
                            index={4}
                            className="rounded-md border"
                          />
                          <InputOTPSlot
                            index={5}
                            className="rounded-l-md border"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      メールに記載された6桁の認証コードを入力してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  form.formState.isValidating
                }
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    問い合わせ中...
                  </>
                ) : (
                  <>パスワードをリセット</>
                )}
              </Button>
            </form>
          </Form>

          <Button variant="ghost" className="w-full" asChild>
            <Link href="/password-reset">戻る</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
