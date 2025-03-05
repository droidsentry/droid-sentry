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
import WifiTableForm from "./wifi-table-form";
import ProxyForm from "./proxy-form";
import VpnForm from "./vpn-form";
import CertificateForm from "./certificatef-form";

export default function NetworkForm({
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
      <div className="space-y-1">
        <h2 className="text-lg font-bold">ネットワーク設定</h2>
        <FormField
          control={form.control}
          name="policyData.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2 h-fit">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  モバイルネットワーク設定の無効化
                </FormLabel>
                <FormDescription>
                  モバイルネットワーク設定変更のみを禁止します。
                  <br />
                  自動でモバイルネットワークはオフになりません。
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
          name="policyData.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2 h-fit">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  データローミングの無効化
                </FormLabel>
                <FormDescription>
                  データローミングの設定変更を禁止します。
                  <br />
                  自動でデータローミングはオフになりません。
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
          name="policyData.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2 h-fit">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  ネットワークリセットの無効化
                </FormLabel>
                <FormDescription>
                  ネットワークリセットを禁止します。
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
              <FormLabel>テザリング設定</FormLabel>
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
                    全てのテザリングを許可
                  </SelectItem>
                  <SelectItem value="ALLOW_USB_DATA_TRANSFER">
                    Wi-Fiテザリングのみを禁止
                  </SelectItem>
                  <SelectItem value="DISALLOW_USB_FILE_TRANSFER">
                    全てのテザリングを禁止
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                ポリシー配信後は、テザリング ON/OFF の変更ができません。
                {field.value === "USB_DATA_ACCESS_UNSPECIFIED" &&
                  "デフォルトとして「USB経由でのファイル転送のみ禁止」が設定されます。"}
                {field.value === "ALLOW_USB_DATA_TRANSFER" &&
                  "※Android 13 未満の端末の場合、「すべてのテザリングを許可する」と同様の動作となります。"}
                {field.value === "DISALLOW_USB_FILE_TRANSFER" &&
                  "OS によってテザリング使用中にポリシーを受信した場合、切断されます。以下を参照ください。\n・Android 9 以降：テザリングが切断されます。\n・Android 9 未満：テザリングが切断されず使用し続けられる場合があります。"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ProxyForm />
        <VpnForm />
        <CertificateForm />
      </div>
      <WifiTableForm policyIdentifier={policyIdentifier} />
    </div>
  );
}
