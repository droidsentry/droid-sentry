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

export default function DeviceGeneralDisplaySettingsForm() {
  const form = useFormContext<FormPolicy>();
  const stayOnPluggedModes = form.getValues("policyData.stayOnPluggedModes");
  const isStayOnPluggedModes = stayOnPluggedModes?.includes(
    "BATTERY_PLUGGED_MODE_UNSPECIFIED"
  );
  const screenTimeoutMode = form.getValues(
    "policyData.displaySettings.screenTimeoutSettings.screenTimeoutMode"
  );
  const isScreenTimeoutMode =
    !screenTimeoutMode ||
    screenTimeoutMode === "SCREEN_TIMEOUT_USER_CHOICE" ||
    screenTimeoutMode === "SCREEN_TIMEOUT_MODE_UNSPECIFIED";
  const screenTimeout = form.getValues(
    "policyData.displaySettings.screenTimeoutSettings.screenTimeout"
  );
  // console.log("screenTimeout", screenTimeout);
  return (
    <div className="space-y-2 border rounded-lg p-4">
      <h2 className="text-lg font-bold">画面自動消灯の設定</h2>
      <FormField
        control={form.control}
        name="policyData.stayOnPluggedModes"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 gap-2">
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">
                充電中の自動消灯を無効化
              </FormLabel>
              <FormDescription>
                電源は AC 充電器、USB
                ポート、ワイヤレスである場合のみ、充電中は自動消灯にしないようにします。
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={Array.isArray(field.value) && field.value.length > 1}
                onCheckedChange={(checked) => {
                  if (checked) {
                    field.onChange(["AC", "USB", "WIRELESS"]);
                    form.setValue("policyData.maximumTimeToLock", "0");
                  } else {
                    field.onChange(["BATTERY_PLUGGED_MODE_UNSPECIFIED"]);
                  }
                }}
                className=""
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="policyData.maximumTimeToLock"
        render={({ field }) => (
          <FormItem
            className={cn(
              "flex flex-row items-center justify-between rounded-lg border p-4 gap-2",
              !isStayOnPluggedModes && "text-muted-foreground"
            )}
          >
            <div className="space-y-1 leading-none w-full">
              <FormLabel className="text-base">
                画面ロックまでの最大時間（分）
              </FormLabel>
              <FormDescription>
                画面ロックまでの最大時間を設定します。
                「充電中の自動消灯を無効化」が有効の場合、画面ロックまでの最大時間は0になります。
              </FormDescription>
              <FormMessage />
            </div>
            <FormControl>
              <Input
                disabled={!isStayOnPluggedModes}
                type="number"
                // ミリ秒から分に変換して表示
                value={
                  field.value
                    ? Math.floor(parseInt(field.value) / (1000 * 60)).toString()
                    : ""
                }
                placeholder="0"
                min={0}
                max={60} // 60分 (3600秒)
                onChange={(e) => {
                  const minutes = e.target.value;
                  if (minutes === "") {
                    field.onChange(null); // 空の場合はnullを設定
                  } else if (parseInt(minutes) <= 60) {
                    // 分からミリ秒に変換して保存
                    const milliseconds = (
                      parseInt(minutes) *
                      60 *
                      1000
                    ).toString();
                    form.clearErrors(
                      "policyData.displaySettings.screenTimeoutSettings.screenTimeout"
                    );
                    field.onChange(milliseconds);
                  }
                }}
                className="w-1/4"
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex flex-col rounded-lg border p-4 gap-4">
        <FormField
          control={form.control}
          name="policyData.displaySettings.screenTimeoutSettings.screenTimeoutMode"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>画面消灯の時間設定</FormLabel>
              <Select
                defaultValue={field.value ?? "SCREEN_TIMEOUT_MODE_UNSPECIFIED"}
                value={field.value ?? "SCREEN_TIMEOUT_MODE_UNSPECIFIED"}
                onValueChange={(value) => {
                  if (!isScreenTimeoutMode) {
                    form.setValue(
                      "policyData.displaySettings.screenTimeoutSettings.screenTimeout",
                      null
                    );

                    form.clearErrors(
                      "policyData.displaySettings.screenTimeoutSettings.screenTimeout"
                    );
                  }
                  field.onChange(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="画面消灯の時間設定" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SCREEN_TIMEOUT_MODE_UNSPECIFIED">
                    指定なし
                  </SelectItem>
                  <SelectItem value="SCREEN_TIMEOUT_USER_CHOICE">
                    手動設定を許可
                  </SelectItem>
                  <SelectItem value="SCREEN_TIMEOUT_ENFORCED">
                    手動設定の禁止
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {field.value === "SCREEN_TIMEOUT_MODE_UNSPECIFIED" &&
                  "デフォルトとして「手動設定を許可」が設定されます。"}
                {field.value === "SCREEN_TIMEOUT_USER_CHOICE" &&
                  "ユーザーが画面消灯の時間を設定できます。"}
                {field.value === "SCREEN_TIMEOUT_ENFORCED" &&
                  "画面消灯時間を強制的に設定します。完全管理対象デバイスの Android 9 以降でサポートされています。または、Android 15 以降の会社所有デバイスの仕事用プロファイルでサポートされています。"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="policyData.displaySettings.screenTimeoutSettings.screenTimeout"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-1 leading-none w-full">
                <FormLabel className="text-base">
                  画面消灯の最大時間（分）
                </FormLabel>
                <FormDescription>
                  画面消灯の最大時間を設定します。
                </FormDescription>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  disabled={isScreenTimeoutMode}
                  type="number"
                  value={
                    field.value ? parseFloat(field.value.replace("m", "")) : ""
                  }
                  min={0}
                  max={30}
                  onChange={(e) => {
                    const minutes = e.target.value;
                    if (minutes === "") {
                      field.onChange(null);
                    } else {
                      // Duration形式（"Xm"）で保存
                      form.clearErrors("policyData.maximumTimeToLock");
                      field.onChange(`${minutes}m`);
                    }
                  }}
                  className="w-1/4"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
