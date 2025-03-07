"use client";

import { signUpNewUser } from "@/actions/auth/auth-supabase";
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
import PasswordForm from "../../components/password-form";

import { extendedSignUpSchema } from "@/app/schemas/auth";
import { SignUp } from "@/app/types/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UsernamePasswordSignUpForm() {
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
        toast.error(error.message);
      });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center pb-4">新規アカウント作成</CardTitle>
        <CardDescription>
          ユーザー名とメールアドレス、パスワードを入力してください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className="space-y-8"
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
      </CardContent>
    </Card>
  );
}
