"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";

import { FormPolicy } from "@/app/types/policy";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
export default function VpnForm() {
  const form = useFormContext<FormPolicy>();
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">VPN設定</h2>
      <FormField
        control={form.control}
        name="policyData.screenCaptureDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2 h-fit">
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">VPN設定の無効化</FormLabel>
              <FormDescription>
                VPNの設定変更を禁止します。
                <br />
                自動でVPNはオフになりません。
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

      <div className="flex flex-row items-center justify-between rounded-lg border p-4 gap-1 h-fit">
        <FormField
          control={form.control}
          name="policyData.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">VPNの常時接続設定</FormLabel>
              </div>
              <FormControl>
                <Input placeholder="VPNアプリ" />
              </FormControl>
            </FormItem>
          )}
        />

        <Switch onCheckedChange={() => {}} className="" />
      </div>
    </div>
  );
}
