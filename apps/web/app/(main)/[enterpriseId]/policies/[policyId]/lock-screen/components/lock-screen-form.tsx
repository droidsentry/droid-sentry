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
// import { usePolicy } from "../../../data/use-policy";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function LockScreenForm({ policyId }: { policyId: string }) {
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
    <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
      <div className="space-y-2 border rounded-lg p-4">
        <h2 className="text-base">画面ロック設定</h2>
        <FormField
          control={form.control}
          name="policyData.passwordPolicies.0.passwordQuality"
          render={({ field }) => (
            <FormItem className="flex flex-col rounded-md border p-4 gap-2">
              <FormLabel>パスワード要件</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? "PASSWORD_QUALITY_UNSPECIFIED"}
                value={field.value ?? "PASSWORD_QUALITY_UNSPECIFIED"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="画面ロック種別" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PASSWORD_QUALITY_UNSPECIFIED">
                    パスワード要件を設定しません。
                  </SelectItem>
                  <SelectItem value="BIOMETRIC_WEAK">
                    生体認証（3 桁の PINを含む）必須
                  </SelectItem>
                  <SelectItem value="SOMETHING">パターン以上必須</SelectItem>
                  <SelectItem value="NUMERIC">PINまたはパスワード</SelectItem>
                  <SelectItem value="NUMERIC_COMPLEX">
                    PINまたはパスワード（推測されやすい数字は禁止）
                  </SelectItem>
                  <SelectItem value="ALPHABETIC">アルファベット必須</SelectItem>
                  <SelectItem value="ALPHANUMERIC">
                    数字・アルファベット（記号）の両方を必須
                  </SelectItem>
                  <SelectItem value="COMPLEX">
                    数字・アルファベット（記号）の両方を必須
                  </SelectItem>
                  <SelectItem value="COMPLEX">
                    より複雑なパスワード設定
                  </SelectItem>
                  <SelectItem value="COMPLEXITY_LOW">
                    最も簡単なパスワード
                  </SelectItem>
                  <SelectItem value="COMPLEXITY_MEDIUM">
                    複雑なパスワード
                  </SelectItem>
                  <SelectItem value="COMPLEXITY_HIGH">
                    最も複雑なパスワード
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {field.value === "PASSWORD_QUALITY_UNSPECIFIED" &&
                  "デフォルトとして「パスワード要件を設定しません。」が設定されます。"}
                {field.value === "BIOMETRIC_WEAK" &&
                  "生体認証（3 桁の PINを含む）必須"}
                {field.value === "SOMETHING" && "パターン以上必須"}
                {field.value === "NUMERIC" && "PINまたはパスワード"}
                {field.value === "NUMERIC_COMPLEX" &&
                  "PINまたはパスワード（推測されやすい数字は禁止）"}
                {field.value === "ALPHABETIC" && "アルファベット必須"}
                {field.value === "ALPHANUMERIC" &&
                  "数字・アルファベット（記号）の両方を必須"}
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
              <FormLabel>パスワードの再設定要求</FormLabel>
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
                    端末準拠
                  </SelectItem>
                  <SelectItem value="ALLOW_USB_DATA_TRANSFER">
                    24時間に1回
                  </SelectItem>
                  <SelectItem value="DISALLOW_USB_FILE_TRANSFER">
                    14日に1回
                  </SelectItem>
                  <SelectItem value="DISALLOW_USB_DATA_TRANSFER">
                    30日に1回
                  </SelectItem>
                  <SelectItem value="DISALLOW_USB_DATA_TRANSFER">
                    60日に1回
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div className="space-y-1 leading-none w-full">
                <FormLabel className="text-base">
                  パスワード設定の最小桁数
                </FormLabel>
                <FormDescription>
                  パスワードの最小桁数を設定します。
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
        <FormField
          control={form.control}
          name="policyData.screenCaptureDisabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
              <div className="space-y-1 leading-none w-full">
                <FormLabel className="text-base">連続入力回数</FormLabel>
                <FormDescription>
                  パスワードの連続入力回数を設定します。
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
        <div className="space-y-2 border rounded-lg p-4">
          <h2 className="text-base">パスワードのカスタム</h2>
          <p className="text-sm text-muted-foreground">
            パスワードのカスタム設定を行います。
          </p>
          <div className="space-y-2 border rounded-lg p-4">
            <FormField
              control={form.control}
              name="policyData.screenCaptureDisabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2">
                  <div className="space-y-1 leading-none w-full">
                    <FormLabel className="text-base">
                      アルファベットの最小桁数
                    </FormLabel>
                    <FormDescription>
                      パスワードのアルファベットの最小桁数を設定します。
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
            <FormField
              control={form.control}
              name="policyData.screenCaptureDisabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2">
                  <div className="space-y-1 leading-none w-full">
                    <FormLabel className="text-base">
                      アルファベット小文字の最小桁数
                    </FormLabel>
                    <FormDescription>
                      パスワードのアルファベット小文字の最小桁数を設定します。
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
            <FormField
              control={form.control}
              name="policyData.screenCaptureDisabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2">
                  <div className="space-y-1 leading-none w-full">
                    <FormLabel className="text-base">
                      アルファベット大文字の最小桁数
                    </FormLabel>
                    <FormDescription>
                      パスワードのアルファベット大文字の最小桁数を設定します。
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
            <FormField
              control={form.control}
              name="policyData.screenCaptureDisabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2">
                  <div className="space-y-1 leading-none w-full">
                    <FormLabel className="text-base">
                      数字・記号の最小桁数
                    </FormLabel>
                    <FormDescription>
                      数字と記号の最小桁数を設定します。
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
            <FormField
              control={form.control}
              name="policyData.screenCaptureDisabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2">
                  <div className="space-y-1 leading-none w-full">
                    <FormLabel className="text-base">数字の最小桁数</FormLabel>
                    <FormDescription>
                      数字の最小桁数を設定します。
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
            <FormField
              control={form.control}
              name="policyData.screenCaptureDisabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2">
                  <div className="space-y-1 leading-none w-full">
                    <FormLabel className="text-base">記号の最小桁数</FormLabel>
                    <FormDescription>
                      記号の最小桁数を設定します。
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
        </div>
        <div className="space-y-2 border rounded-lg p-4">
          <h2 className="text-base">パスワードの更新設定</h2>
          <p className="text-sm text-muted-foreground">
            パスワードの更新設定を行います。
          </p>
          <div className="space-y-2 border rounded-lg p-4">
            <FormField
              control={form.control}
              name="policyData.screenCaptureDisabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2">
                  <div className="space-y-1 leading-none w-full">
                    <FormLabel className="text-base">パスワード履歴</FormLabel>
                    <FormDescription>
                      過去に設定されたパスワードを使用できないようにします。
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
            <FormField
              control={form.control}
              name="policyData.screenCaptureDisabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between gap-2">
                  <div className="space-y-1 leading-none w-full">
                    <FormLabel className="text-base">
                      パスワードの有効期限
                    </FormLabel>
                    <FormDescription>
                      パスワードの有効期限を設定します。
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
        </div>
      </div>
      <div className="space-y-2 border rounded-lg p-4">
        <h2 className="text-base">キーガード設定</h2>
        <p className="text-sm text-muted-foreground">
          キーガードの設定を行います。
        </p>
        <FormField
          control={form.control}
          name="policyData.deviceConnectivityManagement.usbDataAccess"
          render={({ field }) => (
            <FormItem className="flex flex-col rounded-md border p-4 gap-2">
              <FormLabel>画面ロックメッセージ設定</FormLabel>

              <FormControl>
                <Textarea value="" onChange={field.onChange} className="" />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2 border rounded-lg p-4">
          <FormField
            control={form.control}
            name="policyData.screenCaptureDisabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-base">
                    全てのキーガードを無効化
                  </FormLabel>
                  <FormDescription>
                    全てのキーガードを無効化します。
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
                  <FormLabel className="text-base">カメラ無効化</FormLabel>
                  <FormDescription>カメラを無効化します。</FormDescription>
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
                  <FormLabel className="text-base">通知の無効化</FormLabel>
                  <FormDescription>通知を無効化します。</FormDescription>
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
                  <FormLabel className="text-base">生体認証の無効化</FormLabel>
                  <FormDescription>生体認証を無効化します。</FormDescription>
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
                  <FormLabel className="text-base">顔認証の無効化</FormLabel>
                  <FormDescription>顔認証を無効化します。</FormDescription>
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
                  <FormLabel className="text-base">指紋認証の無効化</FormLabel>
                  <FormDescription>指紋認証を無効化します。</FormDescription>
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
    </div>
  );
}
