"use client";

import { getSignUpUrl } from "@/lib/actions/emm/enterprise";
import { createProject } from "@/lib/actions/emm/project";
import { projectSchema } from "@/lib/schemas/project";
import { Project } from "@/lib/types/project";
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
import { Progress } from "@/components/ui/progress";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Rocket } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import SignGoogleCard from "../sign-up/google-sign-up-card";
import { useRouter } from "next/navigation";
interface CreateProjectFormProps {
  title?: string;
  description?: string;
  submitButtonText?: string;
  agreeToTermsButton?: boolean;
}

export default function CreateProjectForm({
  title = "",
  description = "",
  submitButtonText = "",
}: CreateProjectFormProps) {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
      organizationName: "",
    },
  });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const onSubmit = async (data: Project) => {
    startTransition(async () => {
      await createProject(data)
        .then(async (project) => {
          const projectId = project.project_id;
          const projectName = project.project_name;
          const projectOrganizationName = project.organization_name;
          toast.success(
            <div>
              <p>プロジェクトが作成されました</p>
              <p>プロジェクト名: {projectName}</p>
              <p>組織名: {projectOrganizationName}</p>
            </div>
          );
          router.push(`/projects/sign-up?name=${projectName}&Id=${projectId}`);
          // // setIsOpenSignupUrl(true);
          // await getSignUpUrl({ projectId, currentUrl, projectName }).then(
          //   (url) => {
          //     window.open(url, "_blank");
          //     // setSignupUrl(url);
          //     // toast.info(
          //     //   <div>
          //     //     <p>サインアップボタンを押して、サインアップしてください</p>
          //     //   </div>
          //     // );
          //   }
          // );
        })
        .catch((error) => {
          toast.error(error.message);
        });
    });
  };

  return (
    <Card className="max-w-md rounded-xl border-0 p-4 sm:p-6 bg-transparent shadow-none">
      <CardHeader className="text-center mb-4">
        <CardTitle className="text-3xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* {isProgress && <Progress value={progress} className="w-full" />} */}
        <p className="text-center text-muted-foreground tracking-wide">
          {description}
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
                      disabled={isPending}
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
                      disabled={isPending}
                      autoComplete="off"
                      placeholder="任意の組織名"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending || !form.formState.isValid}
              className="w-full font-bold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : (
                <>{submitButtonText}</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
