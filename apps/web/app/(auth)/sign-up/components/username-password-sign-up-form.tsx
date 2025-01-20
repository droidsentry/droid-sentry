"use client";

import { signUpNewUser } from "@/actions/auth-supabase";
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
import { z } from "zod";
import PasswordForm from "../../components/password-form";
import { signUpFormSchema } from "../../schemas/auth-validation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = signUpFormSchema;

type FormData = z.infer<typeof schema>;

export default function UsernamePasswordSignUpForm() {
  const router = useRouter();
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      username: process.env.NEXT_PUBLIC_DEV_USERNAME ?? "",
      email: process.env.NEXT_PUBLIC_DEV_EMAIL ?? "",
      password: process.env.NEXT_PUBLIC_DEV_PASSWORD ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
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
        {/* react-hook-formのuseFormフックから返されたフォームの状態と関数を、
          shadcn/uiのFormコンポーネントに渡している。{...form}はスプレッド構文を使用して、
          formオブジェクトのすべてのプロパティをFormコンポーネントに渡している */}
        <Form {...form}>
          {/* form.handleSubmitは、フォームのバリデーションを行い、
            バリデーションが成功した場合にのみonSubmit関数を実行 */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              // フォームのコントロール（入力フィールドの管理）をFormFieldコンポーネントに渡しています。
              // form.controlは、react-hook-formが提供する機能で、フォームの各フィールドの状態や検証ルールを管理しています。
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ユーザー名</FormLabel>
                  <FormControl>
                    {/* {...field}は、react-hook-formのuseFormフックから提供されるfieldオブジェクトの
                      プロパティ（value, onChange, onBlur, nameなど）をInputコンポーネントに渡しています。
                      これにより、入力フィールドとreact-hook-formの状態管理が連携します。 */}
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
            {/* <Button className="relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                新規アカウント作成
              </span>
            </Button> */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
