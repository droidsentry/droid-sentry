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
import { Input } from "@/components/ui/input";
export default function ProxyForm() {
  const form = useFormContext<FormPolicy>();
  return (
    <div className="">
      <h2 className="text-lg font-bold">プロキシ設定</h2>

      <div className="flex flex-row items-center justify-between rounded-lg border p-4 gap-1 h-fit">
        <FormField
          control={form.control}
          name="policyDetails.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">ホスト</FormLabel>
              </div>
              <FormControl>
                <Input placeholder="ホスト" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="policyDetails.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">ポート番号</FormLabel>
              </div>
              <FormControl>
                <Input placeholder="ポート番号" />
              </FormControl>
            </FormItem>
          )}
        />
        <Switch onCheckedChange={() => {}} className="" />
      </div>
    </div>
  );
}
