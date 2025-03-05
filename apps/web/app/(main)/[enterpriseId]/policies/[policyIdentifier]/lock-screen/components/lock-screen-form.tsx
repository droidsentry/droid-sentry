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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LockScreenForm({
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
    <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
      <div className="space-y-2 border rounded-lg p-4">
        <FormField
          control={form.control}
          name="policyData.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  画面ロック設定の有効化
                </FormLabel>
                <FormDescription>
                  画面ロックの設定を強制します。
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className=""
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
