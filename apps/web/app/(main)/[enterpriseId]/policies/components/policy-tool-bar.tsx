"use client";

import { FormPolicy } from "@/lib/types/policy";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, PlusIcon } from "lucide-react";

import { RouteParams } from "@/lib/types/enterprise";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { createOrUpdatePolicy, isPolicyNameUnique } from "../actions/policy";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import CreateNewPolicyLinkButton from "./table/create-new-policy-link-button";
import SaveAsPolicyButton from "./policy-save-as-button";
import { formPolicySchema } from "@/lib/schemas/policy";
import { Skeleton } from "@/components/ui/skeleton";

export default function PolicyToolBar() {
  const form = useFormContext<FormPolicy>();
  const [isSavePending, startTransitionSave] = useTransition();
  const [isSaveAsPending, startTransitionSaveAs] = useTransition();
  const [isSavingAs, setIsSavingAs] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchPolicyId = searchParams.get("id");
  const param = useParams<RouteParams>();
  let policyId = param.policyId ?? "new";
  if (searchPolicyId) {
    policyId = searchPolicyId;
  }

  const enterpriseId = param.enterpriseId;
  const policyBasePath = `/${enterpriseId}/policies/${policyId}`;
  const currentBase = pathname.split(policyBasePath)[1];
  const { isValidating, isSubmitting, isDirty } = form.formState;

  const handleSave = async (formData: FormPolicy) => {
    startTransitionSave(async () => {
      if (!policyId) {
        toast.error("ポリシーIDが取得できませんでした。");
        return;
      }
      const policyDisplayName = formData.policyDisplayName;
      if (policyId === "new") {
        const isUnique = await isPolicyNameUnique(
          enterpriseId,
          policyDisplayName
        );
        if (!isUnique) {
          toast.error(
            <div className="space-y-1">
              <p>ポリシー名が重複しています。</p>
              <p>別のポリシー名で保存してください。</p>
            </div>
          );
          return;
        }
      }
      await createOrUpdatePolicy({
        enterpriseId,
        policyId,
        formData,
      })
        .then((savedPolicyId) => {
          toast.success("ポリシーを保存しました。");
          router.push(
            `/${enterpriseId}/policies/${savedPolicyId}/${currentBase}`
          );
        })
        .catch((error) => {
          toast.error(error.message);
          // console.error(error);
        });
    });
  };
  useEffect(() => {
    if (policyId !== "new") {
      setIsSavingAs(true);
    }
  }, []);

  const isLoading =
    policyId !== "new" && // 新規作成時はローディングチェックをスキップ
    !isDirty && // フォームが一度も編集されていない
    !form.getValues("policyDisplayName");

  if (isLoading) {
    return (
      <div className="h-12 px-4 flex flex-row items-center gap-2 border-b py-2">
        <Skeleton className="h-8 w-[200px]" />
        <span className="flex-1" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSave, (errors) => {
        // console.log("errors", errors);
        const data = form.getValues();
        const parseResult = formPolicySchema.safeParse(data);
        if (!parseResult.success) {
          toast.error(
            <div className="space-y-1">
              <p>入力内容に問題があります</p>
              {parseResult.error.errors.map((error) => (
                <p key={error.message}>{error.message}</p>
              ))}
            </div>
          );
        }
      })}
      className="h-12 px-4 flex flex-row items-center gap-2 border-b py-2"
    >
      <span className="text-sm">ポリシー名：</span>
      <FormField
        control={form.control}
        name="policyDisplayName"
        render={({ field }) => (
          <FormItem className=" flex flex-row space-x-2 items-center w-[420px]">
            <FormControl>
              <Input
                placeholder="ポリシー名"
                {...field}
                autoComplete="off"
                className="h-8 w-[200px]"
              />
            </FormControl>
            <FormMessage className=" w-[220px] flex items-center mt-1" />
          </FormItem>
        )}
      />
      <span className="flex-1" />
      <CreateNewPolicyLinkButton enterpriseId={enterpriseId} name="新規作成" />
      <SaveAsPolicyButton
        form={form}
        isSavingAs={isSavingAs}
        isSavePending={isSavePending}
        isSaveAsPending={isSaveAsPending}
        startTransitionSaveAs={startTransitionSaveAs}
        setIsSavingAs={setIsSavingAs}
        isValidating={isValidating}
        isSubmitting={isSubmitting}
        enterpriseId={enterpriseId}
        currentBase={currentBase}
        router={router}
      />
      <Button
        disabled={
          isSavePending ||
          isSaveAsPending ||
          // !isValid || // フォームのバリデーションが成功していない場合はボタンを無効にする(初期状態) 新規作成時でエラーが発生するため、使用せず
          isValidating || // フォームのバリデーションが実行中の場合はボタンを無効にする
          isSubmitting || // フォームが送信中の場合はボタンを無効にする
          !form.getValues("policyDisplayName") // ポリシー名が空の場合はボタンを無効にする
        }
        className="h-8 w-20"
      >
        {isSavePending ? <Loader2 className="size-4 animate-spin" /> : "保存"}
      </Button>
    </form>
  );
}
