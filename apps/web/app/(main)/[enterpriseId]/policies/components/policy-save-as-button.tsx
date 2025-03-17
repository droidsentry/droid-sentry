"use client";

import { FormPolicy } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { Loader2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction, TransitionStartFunction } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { createOrUpdatePolicy, isPolicyNameUnique } from "../actions/policy";

interface SaveAsPolicyButtonProps {
  form: UseFormReturn<FormPolicy>;
  isSavingAs: boolean;
  isSavePending: boolean;
  isSaveAsPending: boolean;
  startTransitionSaveAs: TransitionStartFunction;
  setIsSavingAs: Dispatch<SetStateAction<boolean>>;
  isValidating: boolean;
  isSubmitting: boolean;
  enterpriseId: string;
  currentBase: string;
  router: AppRouterInstance;
}

export default function SaveAsPolicyButton({
  form,
  isSavingAs,
  isSavePending,
  isSaveAsPending,
  startTransitionSaveAs,
  setIsSavingAs,
  isValidating,
  isSubmitting,
  enterpriseId,
  currentBase,

  router,
}: SaveAsPolicyButtonProps) {
  const isPolicyNameUniqueCheck = AwesomeDebouncePromise(
    async (policyDisplayName: string) =>
      await isPolicyNameUnique(enterpriseId, policyDisplayName),
    1
  );

  // 別名保存の処理
  const handleSaveAs = async () => {
    // 現在のフォームデータを取得
    const currentFormData = form.getValues();
    const newPolicyName = currentFormData.policyDisplayName;

    // 新しい名前でフォームデータを更新
    const newFormData = {
      ...currentFormData,
      policyDisplayName: newPolicyName,
    };
    startTransitionSaveAs(async () => {
      await isPolicyNameUniqueCheck(newPolicyName);
      // 名前の重複チェック
      const isUnique = await isPolicyNameUniqueCheck(newPolicyName);
      if (!isUnique) {
        toast.error(
          <div className="space-y-1">
            <p>ポリシー名が重複しています。</p>
            <p>別のポリシー名で保存してください。</p>
          </div>
        );
        setIsSavingAs(true);
        return;
      }
      await createOrUpdatePolicy({
        enterpriseId,
        policyId: "new", // 新規ポリシーとして保存
        formData: newFormData,
      })
        .then((savedPolicyIdentifier) => {
          toast.success("ポリシーを別名で保存しました。");
          setIsSavingAs(true);
          router.push(
            `/${enterpriseId}/policies/${savedPolicyIdentifier}/${currentBase}`
          );
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          setIsSavingAs(true);
        });
    });
  };
  console.log(isSavingAs);

  return (
    <Button
      variant="outline"
      type="button"
      onClick={handleSaveAs}
      disabled={
        isSavePending ||
        isSaveAsPending ||
        isValidating ||
        isSubmitting ||
        !form.getValues("policyDisplayName")
      }
      className="h-8 w-20"
    >
      {isSaveAsPending && isSavingAs ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        "別名保存"
      )}
    </Button>
  );
}
