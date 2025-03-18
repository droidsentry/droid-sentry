"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";

import { FormPolicy } from "@/lib/types/policy";
import { Switch } from "@/components/ui/switch";

export default function CertificateForm() {
  const form = useFormContext<FormPolicy>();
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">証明書設定</h2>
      <FormField
        control={form.control}
        name="policyDetails.screenCaptureDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2 h-fit">
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">証明書の変更無効</FormLabel>
              <FormDescription>証明書の変更を禁止します。</FormDescription>
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
  );
}
