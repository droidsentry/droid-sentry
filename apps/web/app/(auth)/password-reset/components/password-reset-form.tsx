"use client";

import { resetPassword } from "@/actions/auth-supabase";
import { emailOrUsernameSchema } from "@/app/(auth)/schemas/password-email-schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import DiscordSingInButton from "../../components/discord-sing-in_button";
import { GitHubLoginButton } from "../../components/github-login-button";
import GoogleSingInButton from "../../components/google-sing-in-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof emailOrUsernameSchema>;

export default function PasswordResetForm() {
  const form = useFormContext<FormData>();
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    await resetPassword(data.emailOrUserName)
      .then(() => {
        toast.success("パスワードリセットのメールを送信しました。");
        router.push("/password-reset/verify");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center py-3 text-xl sm:text-2xl">
          パスワードをお忘れですか？
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pb-2">
          <FormField
            control={form.control}
            name="emailOrUserName"
            render={({ field }) => (
              <FormItem className="pb-2">
                <FormControl>
                  <Input
                    className={`text-center text-xl text-primary ${
                      field.value ? "border-0" : "border-zinc-700"
                    }`}
                    autoComplete="off"
                    placeholder="メールアドレスを入力"
                    {...field}
                  />
                </FormControl>
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
                <Loader2 className="mr-2 size-4 animate-spin" />
                問い合わせ中...
              </>
            ) : (
              <>パスワードをリセットする</>
            )}
          </Button>
        </form>

        <CardDescription className="mb-8 text-center text-xs sm:text-sm pt-5">
          または、別の方法でサインインしてください。
        </CardDescription>
        <div className="flex flex-col gap-2 pb-4">
          <GitHubLoginButton className="w-full" />
          <GoogleSingInButton className="w-full" />
          <DiscordSingInButton className="w-full" />
          <Button variant="outline" className="w-full">
            認証コードをメールに送信
          </Button>
        </div>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => window.history.back()}
        >
          戻る
        </Button>
      </CardContent>
    </Card>
  );
}
