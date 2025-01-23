"use client";

import { createProject } from "@/actions/emm/projects";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Progress } from "@/components/ui/progress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Rocket } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { onboardingSchema } from "../../../schema/onboarding-schema";
import { toast } from "sonner";
import { getSignUpUrl } from "@/actions/emm/signup-url";
import { getBaseURL } from "@/lib/base-url/client";

type FormData = z.infer<typeof onboardingSchema>;

export default function OnboardingForm() {
  const [progress, setProgress] = useState(0);
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      projectName: "",
      organizationName: "",
      agreeToTerms: false,
    },
  });
  const currentUrl = window.location.origin;
  const url = getBaseURL(currentUrl);
  console.log(url);

  const onSubmit = async (data: FormData) => {
    await createProject(data).then(async (project) => {
      toast.success("プロジェクトが作成されました");
      await getSignUpUrl(project.project_id, url, project.project_name);
    });
  };

  // フォームの状態が変更されるたびにprogressを更新
  useEffect(() => {
    const subscription = form.watch((values) => {
      let completedFields = 0;
      if (values.projectName) completedFields++;
      if (values.organizationName) completedFields++;
      if (values.agreeToTerms) completedFields++;

      const newProgress = (completedFields / 3) * 100;
      setProgress(newProgress);
    });

    // クリーンアップ関数を返す
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Card className="max-w-2/3 rounded-xl border-0 p-4 sm:p-6 bg-transparent shadow-none">
      <CardHeader className="text-center">
        <Rocket className="mx-auto size-12 text-blue-400 dark:text-primary" />
        <CardTitle className="text-3xl font-bold">ようこそ！</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="w-full" />
        <p className="text-center text-muted-foreground tracking-wide">
          まずはプロジェクト名と組織名を入力し、
          <br />
          利用規約に同意してください。
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>プロジェクト名</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="任意のプロジェクト名"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>組織名</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="任意の組織名"
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
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                form.formState.isValidating
              }
              className="w-full font-bold"
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : (
                <>使用を開始する</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          variant="link"
          className="text-sm text-muted-foreground"
          asChild
        >
          <Link href="/dashboard">スキップして続行</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
