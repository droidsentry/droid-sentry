"use client";

import { FormPolicy } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { createOrUpdatePolicy, isPolicyNameUnique } from "../actions/policy";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { UseFormReturn } from "react-hook-form";
import { Dispatch, SetStateAction, TransitionStartFunction } from "react";

interface SaveAsPolicyButtonProps {
  form: UseFormReturn<FormPolicy>;
  isPending: boolean;
  isSavingAs: boolean;
  setIsSavingAs: Dispatch<SetStateAction<boolean>>;
  isValidating: boolean;
  isSubmitting: boolean;
  enterpriseId: string;
  currentBase: string;
  startTransition: TransitionStartFunction;
  router: AppRouterInstance;
}

export default function SaveAsPolicyButton({
  form,
  isPending,
  isSavingAs,
  setIsSavingAs,
  isValidating,
  isSubmitting,
  enterpriseId,
  currentBase,
  startTransition,
  router,
}: SaveAsPolicyButtonProps) {
  const isPolicyNameUniqueCheck = AwesomeDebouncePromise(
    async (policyDisplayName: string) =>
      await isPolicyNameUnique(enterpriseId, policyDisplayName),
    800
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
    setIsSavingAs(true);
    startTransition(async () => {
      // 名前の重複チェック
      const isUnique = await isPolicyNameUniqueCheck(newPolicyName);
      if (!isUnique) {
        toast.error(
          <div className="space-y-1">
            <p>ポリシー名が重複しています。</p>
            <p>別のポリシー名で保存してください。</p>
          </div>
        );
        return;
      }
      await createOrUpdatePolicy({
        enterpriseId,
        policyIdentifier: "new", // 新規ポリシーとして保存
        formData: newFormData,
      })
        .then((savedPolicyIdentifier) => {
          toast.success("ポリシーを別名で保存しました。");
          router.push(
            `/${enterpriseId}/policies/${savedPolicyIdentifier}/${currentBase}`
          );
        })
        .catch((error) => {
          toast.error("ポリシーを保存できませんでした。");
          console.error(error);
        })
        .finally(() => {
          setIsSavingAs(false);
        });
    });
  };

  return (
    <Button
      variant="outline"
      type="button"
      onClick={handleSaveAs}
      disabled={
        isPending ||
        isValidating ||
        isSubmitting ||
        !form.getValues("policyDisplayName")
      }
      className="h-8"
    >
      {isPending && isSavingAs ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          別名保存中...
        </>
      ) : (
        "別名保存"
      )}
    </Button>
  );
}
