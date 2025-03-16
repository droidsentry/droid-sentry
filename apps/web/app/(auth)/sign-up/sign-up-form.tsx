"use client";

import { signUpNewUser } from "@/actions/auth/supabase";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import PasswordForm from "../components/password-form";

import { extendedSignUpSchema } from "@/app/schemas/auth";
import { SignUp } from "@/app/types/auth";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DiscordSingButton from "../components/discord-sing-button";
import { GitHubSignButton } from "../components/github-login-button";
import GoogleSingButton from "../components/google-sing-in-button";

export default function SignUpForm() {
  const t = useTranslations("auth.errors");

  const router = useRouter();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(extendedSignUpSchema),
    defaultValues: {
      username: process.env.NEXT_PUBLIC_DEV_USERNAME ?? "",
      email: process.env.NEXT_PUBLIC_DEV_EMAIL ?? "",
      password: process.env.NEXT_PUBLIC_DEV_PASSWORD ?? "",
    },
  });

  const handleSignUp = async (data: SignUp) => {
    await signUpNewUser(data)
      .then((id) => {
        toast.success("サインアップ登録が完了しました。");
        router.push(`/sign-up/verify-email-address?id=${id}`);
      })
      .catch((error) => {
        const errorCode = error.message;
        // ユーザー利用上限エラーの場合、特別な処理を行う
        if (errorCode === "E1001") {
          toast.error(t(errorCode));
          router.push("/waiting");
        } else if (errorCode !== "NEXT_REDIRECT") {
          toast.error(errorCode);
        }
      });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center my-3 text-xl sm:text-2xl">
          新規アカウント作成
        </CardTitle>
        <CardDescription>
          ユーザー名とメールアドレス、パスワードを入力してください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザー名</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="山田太郎"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メールアドレス</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="test@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <PasswordForm
              form={form}
              name="password"
              autoComplete={"new-password"}
            />

            <Button
              disabled={
                !form.formState.isValid || // フォームのバリデーションが成功していない場合はボタンを無効にする(初期状態)
                form.formState.isSubmitting || // フォームが送信中の場合はボタンを無効にする
                form.formState.isValidating // フォームのバリデーションが実行中の場合はボタンを無効にする
              }
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  サインアップ中...
                </>
              ) : (
                <>新規アカウント作成</>
              )}
            </Button>
          </form>
        </Form>
        <CardDescription className=" text-center text-xs sm:text-sm my-6">
          または、下記の方法でサインアップしてください。
        </CardDescription>
        <div className="flex flex-col gap-2 pb-4">
          <GitHubSignButton className="w-full" />
          <GoogleSingButton className="w-full" />
          <DiscordSingButton className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
