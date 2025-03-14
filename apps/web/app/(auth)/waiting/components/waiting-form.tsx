"use client";

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
import BusinessmanBowing from "./images/businessman_bowing.png";

import { waitingSchema } from "@/app/schemas/auth";
import { Waiting } from "@/app/types/auth";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { sendWaitingNotification } from "./actions";
import WaitingVerifyCard from "./waiting-verify-card";
import { UserMetadata } from "@supabase/supabase-js";

export default function WaitingForm({
  username,
  email,
}: {
  username?: string;
  email?: string;
}) {
  const [isVerified, setIsVerified] = useState(true);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(waitingSchema),
    defaultValues: {
      username: username || process.env.NEXT_PUBLIC_DEV_USERNAME || "",
      email: email || process.env.NEXT_PUBLIC_DEV_EMAIL || "",
    },
  });

  const handleWaiting = async (data: Waiting) => {
    startTransition(async () => {
      await sendWaitingNotification(data)
        .then(() => {
          let message = "登録が完了しました。";
          if (!isVerified) {
            message = "再度、メールを送信しました。";
          }
          toast.success(message);
          setIsVerified(false);
        })
        .catch((error) => {
          const message = error.message;
          toast.error(message);
        });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleWaiting)} className="space-y-5">
        {isVerified ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center my-3 text-xl sm:text-2xl">
                利用制限のお知らせ
              </CardTitle>
              <div className="aspect-square flex items-center justify-center dark:bg-white bg-muted/50 rounded-3xl border mb-6 lg:w-3/5 mx-auto">
                <Image
                  src={BusinessmanBowing}
                  alt="businessman bowing"
                  priority
                />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="lg:text-lg">
                現在、ユーザーの利用制限に達しているため、
                <br />
                新規アカウントの作成ができません。
              </CardDescription>
              <CardDescription className="lg:text-lg">
                空き枠ができた際にメールでお知らせしてもよろしいでしょうか？
              </CardDescription>
              <div className="flex flex-col gap-4 mt-4">
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
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/">ホームに戻る</Link>
                  </Button>
                  <Button
                    disabled={
                      isPending ||
                      !form.formState.isValid || // フォームのバリデーションが成功していない場合はボタンを無効にする(初期状態)
                      form.formState.isSubmitting || // フォームが送信中の場合はボタンを無効にする
                      form.formState.isValidating // フォームのバリデーションが実行中の場合はボタンを無効にする
                    }
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        確認中...
                      </>
                    ) : (
                      <>希望する</>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="md:mt-20">
            <WaitingVerifyCard
              setIsVerified={setIsVerified}
              isPending={isPending}
            />
          </div>
        )}
      </form>
    </Form>
  );
}
