"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

import { FormPolicy } from "@/app/types/policy";
// import { usePolicy } from "../../../data/use-policy";
import { Loader2 } from "lucide-react";

export default function DeviceGeneralForm({
  policyIdentifier,
}: {
  policyIdentifier: string;
}) {
  const form = useFormContext<FormPolicy>();

  const isLoading =
    policyIdentifier !== "new" && // 新規作成時はローディングチェックをスキップ
    !form.formState.isDirty && // フォームが一度も編集されていない
    !form.getValues("policyDisplayName");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <FormField
        control={form.control}
        name="policyData.screenCaptureDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
            <div className="space-y-1 leading-none">
              <FormLabel>画面キャプチャーの無効化</FormLabel>
              <FormDescription>
                画面キャプチャーを無効にします。
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="policyData.bluetoothConfigDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
            <div className="space-y-1 leading-none">
              <FormLabel>Bluetoothの設定の無効化</FormLabel>
              <FormDescription>Bluetoothの設定を無効にします。</FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
