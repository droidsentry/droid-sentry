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

import { FormPolicy } from "@/lib/types/policy";
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
import { cn } from "@/lib/utils";
import DeviceGeneralDisplaySettingsForm from "./device-general-display-settings-form";
import DeviceGeneralSystemUpdateForm from "./device-general-system-update-form";

export default function DeviceGeneralForm({ policyId }: { policyId: string }) {
  const form = useFormContext<FormPolicy>();

  const isLoading =
    policyId !== "new" && // 新規作成時はローディングチェックをスキップ
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
        name="policyDetails.screenCaptureDisabled"
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
        name="policyDetails.bluetoothConfigDisabled"
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
        name="policyDetails.adjustVolumeDisabled"
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
        name="policyDetails.smsDisabled"
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
        name="policyDetails.mountPhysicalMediaDisabled"
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
        name="policyDetails.cellBroadcastsConfigDisabled"
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
        name="policyDetails.outgoingBeamDisabled"
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
        name="policyDetails.factoryResetDisabled"
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
        name="policyDetails.modifyAccountsDisabled"
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
        name="policyDetails.outgoingCallsDisabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">電話発信の無効化</FormLabel>
              <FormDescription>電話発信ができなくなります。</FormDescription>
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
        name="policyDetails.deviceConnectivityManagement.usbDataAccess"
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
        name="policyDetails.cameraAccess"
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-md border p-4 gap-2">
            <FormLabel>カメラ設定</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? "CAMERA_ACCESS_UNSPECIFIED"}
              value={field.value ?? "CAMERA_ACCESS_UNSPECIFIED"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="カメラ設定" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="CAMERA_ACCESS_UNSPECIFIED">
                  設定なし
                </SelectItem>
                <SelectItem value="CAMERA_ACCESS_USER_CHOICE">
                  カメラ使用許可
                </SelectItem>
                <SelectItem value="CAMERA_ACCESS_DISABLED">
                  カメラ使用禁止
                </SelectItem>
                <SelectItem value="CAMERA_ACCESS_ENFORCED">
                  アプリのカメラ使用を強制的に有効
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              {field.value === "CAMERA_ACCESS_UNSPECIFIED" &&
                "デフォルト設定：すべてのカメラが使用可能です。Android 12以降では、ユーザーがカメラアクセスの切り替えボタンを使用できます。"}
              {field.value === "CAMERA_ACCESS_USER_CHOICE" &&
                "すべてのカメラが使用可能です。Android 12以降では、ユーザーがカメラアクセスの切り替えボタンを使用できます。"}
              {field.value === "CAMERA_ACCESS_DISABLED" &&
                "カメラ使用を禁止します。完全管理対象デバイスではデバイス全体に適用され、仕事用プロファイルではプロファイル内のみに適用されます。仕事用プロファイルでは、プロファイル外のアプリには影響しません。"}
              {field.value === "CAMERA_ACCESS_ENFORCED" &&
                "カメラ使用を強制的に有効にします。Android 12以降の完全管理対象デバイスでは、ユーザーによるカメラアクセスの切り替えができなくなります。その他のデバイスでは「カメラ使用許可」と同じ動作になります。"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="space-y-2 border rounded-lg p-4">
        <h2 className="text-lg font-bold">ユーザー設定</h2>
        <FormField
          control={form.control}
          name="policyDetails.addUserDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  新しいユーザーとプロファイルの追加
                </FormLabel>
                <FormDescription>
                  新しいユーザーとプロファイルの追加を無効化します。
                  デバイスオーナーで管理されているデバイスは、デフォルトでユーザーはユーザーの追加や削除ができません。
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
          name="policyDetails.removeUserDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  ユーザー削除を無効化
                </FormLabel>
                <FormDescription>
                  デバイスに追加されているユーザーの削除を無効化します。
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
      <DeviceGeneralDisplaySettingsForm />

      <div className="space-y-2 border rounded-lg p-4">
        <h2 className="text-lg font-bold">位置情報共有を無効化</h2>
        <FormField
          control={form.control}
          name="policyDetails.shareLocationDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  位置情報共有の無効化
                </FormLabel>
                <FormDescription>
                  現在地の共有が無効になります。
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
          name="policyDetails.locationMode"
          render={({ field }) => (
            <FormItem className="flex flex-col rounded-md border p-4 gap-2">
              <FormLabel>位置情報の検出設定</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? "LOCATION_MODE_UNSPECIFIED"}
                value={field.value ?? "LOCATION_MODE_UNSPECIFIED"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="位置情報の検出設定" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="LOCATION_MODE_UNSPECIFIED">
                    設定なし
                  </SelectItem>
                  <SelectItem value="LOCATION_USER_CHOICE">
                    ユーザーの選択を許可
                  </SelectItem>
                  <SelectItem value="LOCATION_ENFORCED">
                    位置情報検出を強制的に有効
                  </SelectItem>
                  <SelectItem value="LOCATION_UNSPECIFIED">
                    位置情報検出を強制的に無効
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {field.value === "LOCATION_MODE_UNSPECIFIED" &&
                  "デフォルトとして「ユーザーの選択を許可」が設定されます。"}
                {field.value === "LOCATION_USER_CHOICE" &&
                  "ユーザーが位置情報の検出を選択できるようになります。"}
                {field.value === "LOCATION_ENFORCED" &&
                  "位置情報検出を強制的に有効にします。"}
                {field.value === "LOCATION_UNSPECIFIED" &&
                  "位置情報検出を強制的に無効にします。"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* <DeviceGeneralSystemUpdateForm /> */}
    </div>
  );
}
