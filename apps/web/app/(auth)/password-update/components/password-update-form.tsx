"use client";

import { updatePassword } from "@/actions/auth/auth-supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordForm from "../../components/password-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { passwordUpdateSchema } from "@/app/schema/auth";
import { useEmailOrUsername } from "../../providers/user";

const schema = passwordUpdateSchema;

type FormData = z.infer<typeof schema>;

export default function PasswordUpdateForm() {
  const { emailOrUsername } = useEmailOrUsername();
  const router = useRouter();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    await updatePassword(data)
      .then(() => {
        toast.success("パスワードを更新しました。");
        router.push("/projects");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center py-3 text-xl sm:text-2xl">
          新しいパスワードを設定
        </CardTitle>
        <div className="mb-8 text-center text-lg sm:text-xl">
          {emailOrUsername}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 pb-4"
          >
            <PasswordForm
              label="新しいパスワード"
              form={form}
              name="password"
              autoComplete="new-password"
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
          <Link href="/password-reset">リセットをやめる</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
