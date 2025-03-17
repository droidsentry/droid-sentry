"use client";

import { extendedOnboardingUserSchema } from "@/app/schemas/project";
import { OnboardingUser } from "@/app/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Loader2, Rocket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerOnboardingUser } from "./actions";

export default function OnboardingForm({
  username,
  email,
}: {
  username: string;
  email: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(extendedOnboardingUserSchema),
    defaultValues: {
      username: username || "",
      email: email || "",
      agreeToTerms: false,
    },
  });
  const onSubmit = async (data: OnboardingUser) => {
    startTransition(async () => {
      await registerOnboardingUser(data)
        .then((res) => {
          toast.success("登録が完了しました。次にプロジェクトを作成します。");
          router.push("/projects/new");
        })
        .catch((err) => {
          toast.error(err.message);
        });
    });
  };

  return (
    <Card className="max-w-2/3 rounded-xl border-0 p-4 sm:p-6 bg-transparent shadow-none">
      <CardHeader className="text-center">
        <Rocket className="mx-auto size-12 text-blue-400 dark:text-primary mb-4" />
        <CardTitle className="text-3xl font-bold">ようこそ！</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground tracking-wide">
          事前に登録したユーザー名を確認し、
          <br />
          利用規約に同意してください
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザー名</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="任意のユーザー名"
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
                      disabled={true}
                      autoComplete="off"
                      placeholder="任意のメールアドレス"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel htmlFor="agreeToTerms" className="ml-2 text-sm">
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      利用規約
                    </Link>{" "}
                    および{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      プライバシーポリシー
                    </Link>{" "}
                    に同意する。
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={
                isPending ||
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                form.formState.isValidating
              }
              className="w-full font-bold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : (
                <>ユーザー名を登録する</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
