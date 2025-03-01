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
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
      <FormField
        control={form.control}
        name="policyData.screenCaptureDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">
                スクリーンショットの無効化
              </FormLabel>
              <FormDescription>
                ADB接続による画面のミラーリングも無効化されます。
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
      <FormField
        control={form.control}
        name="policyData.bluetoothConfigDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">Bluetooth設定の無効化</FormLabel>
              <FormDescription>
                無効化された場合、Bluetooth設定の変更ができなくなります。
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
      <FormField
        control={form.control}
        name="policyData.adjustVolumeDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">音量調整の無効化</FormLabel>
              <FormDescription>
                無効化された場合、ミュート状態となります。
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
      <FormField
        control={form.control}
        name="policyData.factoryResetDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">初期化を無効化</FormLabel>
              <FormDescription>
                設定からの「全データを消去」ができなくなります。
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
      <FormField
        control={form.control}
        name="policyData.deviceConnectivityManagement.usbDataAccess"
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-md border p-4 gap-2">
            <FormLabel>USB接続設定</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? "USB_DATA_ACCESS_UNSPECIFIED"}
              value={field.value ?? "USB_DATA_ACCESS_UNSPECIFIED"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="USB接続した際の動作選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="USB_DATA_ACCESS_UNSPECIFIED">
                  指定なし
                </SelectItem>
                <SelectItem value="ALLOW_USB_DATA_TRANSFER">
                  USBデータ転送を許可
                </SelectItem>
                <SelectItem value="DISALLOW_USB_FILE_TRANSFER">
                  USB経由でのファイル転送のみ禁止
                </SelectItem>
                <SelectItem value="DISALLOW_USB_DATA_TRANSFER">
                  全てのUSBのデータ転送を禁止
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              {field.value === "USB_DATA_ACCESS_UNSPECIFIED" &&
                "デフォルトとして「USB経由でのファイル転送のみ禁止」が設定されます。"}
              {field.value === "ALLOW_USB_DATA_TRANSFER" &&
                "USB経由でファイル転送ができるようになります。"}
              {field.value === "DISALLOW_USB_FILE_TRANSFER" &&
                "USB経由でのファイル転送のみできません。マウスやキーボードの接続など、USBデータ接続は制限されません。"}
              {field.value === "DISALLOW_USB_DATA_TRANSFER" &&
                "全てのUSBデータ転送ができません。Android12かつ、USB HAL 1.3以降のデバイスのみサポートされます。サポート外のデバイスは、「USB経由でのファイル転送のみ禁止」が設定されます。"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
