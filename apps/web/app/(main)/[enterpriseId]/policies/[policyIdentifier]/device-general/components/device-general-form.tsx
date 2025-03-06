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
import { Input } from "@/components/ui/input";
import { DialogContent } from "@/components/ui/dialog";

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
        name="policyData.adjustVolumeDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">SMSの無効化</FormLabel>
              <FormDescription>
                SMSの送信、受信ができなくなります。
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
              <FormLabel className="text-base">
                時刻の手動変更を無効化
              </FormLabel>
              <FormDescription>
                時刻の手動変更ができなくなります。
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
              <FormLabel className="text-base">
                外部ストレージのマウントを無効化
              </FormLabel>
              <FormDescription>
                外部ストレージのマウントができなくなります。
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
              <FormLabel className="text-base">
                緊急速報メールの無効化
              </FormLabel>
              <FormDescription>
                緊急速報メールの受信ができなくなります。
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
              <FormLabel className="text-base">開発者モードの無効化</FormLabel>
              <FormDescription>
                開発者モードが使用できなくなります。
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
              <FormLabel className="text-base">Androidビームの無効化</FormLabel>
              <FormDescription>
                Androidビームが使用できなくなります。
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
        name="policyData.factoryResetDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">
                アカウント追加・削除設定の無効化
              </FormLabel>
              <FormDescription>
                アカウント追加・削除設定ができなくなります。
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
      <FormField
        control={form.control}
        name="policyData.deviceConnectivityManagement.usbDataAccess"
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-md border p-4 gap-2">
            <FormLabel>カメラ設定</FormLabel>
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
                  カメラ使用許可
                </SelectItem>
                <SelectItem value="ALLOW_USB_DATA_TRANSFER">
                  カメラ使用禁止
                </SelectItem>
                <SelectItem value="DISALLOW_USB_FILE_TRANSFER">
                  アプリのカメラ使用を強制的に有効
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
      <div className="space-y-2 border rounded-lg p-4">
        <h2 className="text-lg font-bold">ユーザー設定</h2>
        <FormField
          control={form.control}
          name="policyData.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  ユーザー追加を無効化
                </FormLabel>
                <FormDescription>
                  ユーザー追加ができなくなります。
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  ユーザー削除を無効化
                </FormLabel>
                <FormDescription>
                  ユーザー削除ができなくなります。
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

      <div className="space-y-2 border rounded-lg p-4">
        <h2 className="text-lg font-bold">スリープモードの設定</h2>
        <FormField
          control={form.control}
          name="policyData.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  充電中のスリープモードを無効化
                </FormLabel>
                <FormDescription>
                  充電中はスリープモードにしないようにします。
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div className="space-y-1 leading-none w-full">
                <FormLabel className="text-base">スリープの最大時間</FormLabel>
                <FormDescription>
                  スリープの最大時間を設定します。
                </FormDescription>
              </div>
              <FormControl>
                <Input
                  type="number"
                  value=""
                  onChange={field.onChange}
                  className=""
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-2 border rounded-lg p-4">
        <h2 className="text-lg font-bold">位置情報の設定</h2>
        <FormField
          control={form.control}
          name="policyData.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  位置情報取得の無効化
                </FormLabel>
                <FormDescription>
                  位置情報の取得ができなくなります。
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
              <FormLabel>位置情報の検出設定</FormLabel>
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
                    位置情報検出を強制的に有効
                  </SelectItem>
                  <SelectItem value="DISALLOW_USB_FILE_TRANSFER">
                    位置情報検出を強制的に無効
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
                <FormDescription>
                  アップデート時刻を設定します。
                </FormDescription>
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
    </div>
  );
}
