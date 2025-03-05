"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import PasswordWithResetForm from "../../components/password-with-reset-form";

import { signInWithEmailOrUsername } from "@/actions/auth/auth-supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { SignIn } from "../../../types/auth";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("from");
  const [isLoading, startTransition] = useTransition();
  const form = useFormContext<SignIn>();
  const onSubmit = async (formData: SignIn) => {
    startTransition(async () => {
      await signInWithEmailOrUsername(formData)
        .then(() => {
          if (returnUrl) {
            router.push(returnUrl);
          } else {
            router.push("/projects");
          }
        })
        .catch(async (error) => {
          toast.error(error.message);
        });
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={form.control}
        name="emailOrUsername"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              メールアドレス {"  "}or {"  "}ユーザー名
            </FormLabel>
            <FormControl>
              <Input autoComplete="off" placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <PasswordWithResetForm
        form={form}
        name="password"
        autoComplete={"new-password"}
      />
      <Button
        disabled={
          !form.formState.isValid ||
          form.formState.isSubmitting ||
          form.formState.isValidating ||
          isLoading
        }
      >
        {form.formState.isSubmitting || isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            サインイン中...
          </>
        ) : (
          <>サインイン</>
        )}
      </Button>
      <Button
        variant="ghost"
        className="text-muted-foreground text-xs ml-4"
        asChild
      ></Button>
    </form>
  );
}
