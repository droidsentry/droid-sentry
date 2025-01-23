"use client";

import { FormPolicy } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useTransition } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { createOrUpdatePolicy } from "../actions/policy";
import { RouteParams } from "@/app/types/enterprise";
import { formPolicySchema } from "@/app/schema/policy";

export default function PolicyToolBar() {
  const form = useFormContext<FormPolicy>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchPolicyIdentifier = searchParams.get("id");
  const param = useParams<RouteParams>();
  let policyIdentifier = param.policyIdentifier ?? "new";
  if (searchPolicyIdentifier) {
    policyIdentifier = searchPolicyIdentifier;
  }
  const enterpriseId = param.enterpriseId;

  const policyBasePath = `/${enterpriseId}/policies/${policyIdentifier}`;
  const currentBase = pathname.split(policyBasePath)[1]; //device-general, device-security, etc.

  const handleSave = async (data: FormPolicy) => {
    startTransition(async () => {
      if (!policyIdentifier) {
        toast.error("ポリシーIDが取得できませんでした。");
        return;
      }
      if (!data.policyDisplayName) {
        toast.error("ポリシー名を設定してください。");
        return;
      }
      const policyDisplayName = data.policyDisplayName;
      const parsed = formPolicySchema.parse(data);
      const savedPolicyIdentifier = await createOrUpdatePolicy({
        enterpriseId,
        policyIdentifier,
        policyDisplayName,
        requestBody: parsed.policyData,
      });
      router.push(
        `/${enterpriseId}/policies/${savedPolicyIdentifier}/${currentBase}`
      );
    });
  };

  const isLoading =
    policyIdentifier !== "new" && // 新規作成時はローディングチェックをスキップ
    !form.formState.isDirty && // フォームが一度も編集されていない
    !form.getValues("policyDisplayName");

  if (isLoading) {
    return null;
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSave)}
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
      <Button
        disabled={isPending || !form.formState.isValid}
        className="h-8"
        variant="outline"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            保存中...
          </>
        ) : (
          "保存"
        )}
      </Button>
    </form>
  );
}
