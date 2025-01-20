"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFormContext } from "react-hook-form";

import { FormPolicy } from "@/app/types/policy";

export default function GooglePlayForm() {
  const form = useFormContext<FormPolicy>();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-2">
      <FormField
        control={form.control}
        name="policyData.playStoreMode"
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-md border p-4">
            <FormLabel>Play ストア モード</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? "PLAY_STORE_MODE_UNSPECIFIED"}
              value={field.value ?? "PLAY_STORE_MODE_UNSPECIFIED"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Play ストア モードを選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="WHITELIST">
                  ホワイトリスト - 登録アプリのみ使用可能
                </SelectItem>
                <SelectItem value="BLACKLIST">
                  ブラックリスト - すべてのアプリ使用可能
                </SelectItem>
                <SelectItem value="PLAY_STORE_MODE_UNSPECIFIED">
                  指定なし（デフォルト：ホワイトリスト）
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              デバイスで使用可能なアプリケーションの制御方法を設定します。
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
