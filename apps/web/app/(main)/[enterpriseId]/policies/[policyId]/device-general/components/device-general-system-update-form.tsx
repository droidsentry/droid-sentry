"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";

import { FormPolicy } from "@/lib/types/policy";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function DeviceGeneralSystemUpdateForm() {
  const form = useFormContext<FormPolicy>();

  return (
    <div className="space-y-2 border rounded-lg p-4">
      <h2 className="text-lg font-bold">OSアップデート</h2>
      <FormField
        control={form.control}
        name="policyData.deviceConnectivityManagement.usbDataAccess"
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-md border p-4 gap-2">
            <FormLabel>OSアップデートの設定</FormLabel>
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
                  設定なし
                </SelectItem>
                <SelectItem value="ALLOW_USB_DATA_TRANSFER">
                  即時にアップデート
                </SelectItem>
                <SelectItem value="DISALLOW_USB_FILE_TRANSFER">
                  指定した時刻にアップデート
                </SelectItem>
                <SelectItem value="DISALLOW_USB_FILE_TRANSFER">
                  30日間のアップデートを延期
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
      <FormField
        control={form.control}
        name="policyData.screenCaptureDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center justify-between rounded-lg border p-4 gap-2">
            <div className="space-y-1 leading-none w-full">
              <FormLabel className="text-base">アップデート時刻</FormLabel>
              <FormDescription>アップデート時刻を設定します。</FormDescription>
            </div>
            <FormControl>
              <Input
                type="number"
                value=""
                onChange={field.onChange}
                className="sr-only"
              />
            </FormControl>
            <div className="flex flex-row gap-2">
              <Input
                type="number"
                value=""
                onChange={field.onChange}
                className=""
              />
              <span className="text-sm text-muted-foreground text-center">
                〜
              </span>
              <Input
                type="number"
                value=""
                onChange={field.onChange}
                className=""
              />
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="policyData.screenCaptureDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-col items-center justify-between rounded-lg border p-4 gap-2">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">アップデート停止</FormLabel>
                <FormDescription>
                  最大90日間アップデートを停止します。
                </FormDescription>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className=""
              />
            </div>
            <FormControl>
              <Input
                type="number"
                value=""
                onChange={field.onChange}
                className="sr-only"
              />
            </FormControl>
            <div className="flex flex-row gap-2">
              <Input
                type="number"
                value=""
                onChange={field.onChange}
                className=""
              />
              <span className="text-sm text-muted-foreground text-center">
                〜
              </span>
              <Input
                type="number"
                value=""
                onChange={field.onChange}
                className=""
              />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
