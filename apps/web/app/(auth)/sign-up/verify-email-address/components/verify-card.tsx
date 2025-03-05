"use client";

import { resendSignUpOPT } from "@/actions/auth/auth-supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyCard() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleResendSignUpOPT = async () => {
    startTransition(async () => {
      const id = searchParams.get("id");
      if (!id) {
        toast.error(
          "確認メールの再送ができませんでした。お手数ですが、もう一度新規登録をお願いいたします。"
        );
        return;
      }
      await resendSignUpOPT({ type: "signup", id }).then((res) => {
        if (res?.message) {
          toast.success(res.message);
        }
      });
    });
  };

  return (
    <Card className="max-w-md rounded-xl forced-colors:outline">
      <CardHeader className="text-center">
        <Send className="size-12 mx-auto mb-4 text-blue-400" />
        <CardTitle className="text-2xl font-bold">
          確認メールを送信しました。
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground tracking-wide">
          ご登録したメールアドレスにメールを送信しました。
          <br />
          メールを確認してください。
        </p>
        <ul className="text-sm text-gray-500 text-left list-none pl-0">
          <li className="flex">
            <span className="flex-shrink-0 w-5">※</span>
            <span>
              受信トレイにメールが見当たらない場合は、迷惑メールフォルダを確認してください。
            </span>
          </li>
          <li className="flex">
            <span className="flex-shrink-0 w-5">※</span>
            <span>メールが届くまで時間がかかる場合があります。</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {isPending ? (
          <Button className="w-2/3" disabled={isPending}>
            <Loader2 className="mr-4 h-4 w-4 animate-spin" />
            <span>送信中...</span>
          </Button>
        ) : (
          <Button
            onClick={handleResendSignUpOPT}
            className="w-2/3"
            disabled={isPending}
          >
            <Mail className="mr-4 h-4 w-4" />
            <span>確認メールを再送信</span>
          </Button>
        )}
        <Button asChild variant="outline" className="w-2/3">
          <Link href="/sign-up">新規アカウント作成画面に戻る</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
