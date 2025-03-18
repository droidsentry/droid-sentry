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

import { FormPolicy } from "@/lib/types/policy";

export default function GooglePlayForm() {
  const form = useFormContext<FormPolicy>();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-2">
      <FormField
        control={form.control}
        name="policyDetails.playStoreMode"
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
      <FormField
        control={form.control}
        name="policyDetails.playStoreMode"
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-md border p-4">
            <FormLabel>アプリ更新設定</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? "PLAY_STORE_MODE_UNSPECIFIED"}
              value={field.value ?? "PLAY_STORE_MODE_UNSPECIFIED"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="アプリ更新設定を選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="WHITELIST">
                  Wi-Fi接続時のみ自動更新
                </SelectItem>
                <SelectItem value="BLACKLIST">自動更新</SelectItem>
                <SelectItem value="BLACKLIST">90日間延期</SelectItem>
                <SelectItem value="PLAY_STORE_MODE_UNSPECIFIED">
                  指定なし（デフォルト：ホワイトリスト）
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>アプリの自動更新を設定します。</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="policyDetails.playStoreMode"
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-md border p-4">
            <FormLabel>提供元不明アプリ</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? "PLAY_STORE_MODE_UNSPECIFIED"}
              value={field.value ?? "PLAY_STORE_MODE_UNSPECIFIED"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="提供元不明アプリの設定を選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="WHITELIST">インストールを許可</SelectItem>
                <SelectItem value="BLACKLIST">インストールを禁止</SelectItem>
                <SelectItem value="PLAY_STORE_MODE_UNSPECIFIED">
                  指定なし（デフォルト：許可）
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              提供元不明のアプリをインストールするかどうかを設定します。
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="policyDetails.playStoreMode"
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-md border p-4">
            <FormLabel>Playプロテクトの設定</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? "PLAY_STORE_MODE_UNSPECIFIED"}
              value={field.value ?? "PLAY_STORE_MODE_UNSPECIFIED"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Playプロテクトの設定を選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="BLACKLIST">
                  Playプロテクトのスキャンを強制的に有効化
                </SelectItem>
                <SelectItem value="PLAY_STORE_MODE_UNSPECIFIED">
                  設定なし
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>Playプロテクト設定を制御します。</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="policyDetails.playStoreMode"
        render={({ field }) => (
          <FormItem className="flex flex-col rounded-md border p-4">
            <FormLabel>アプリのパーミッション設定</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? "PLAY_STORE_MODE_UNSPECIFIED"}
              value={field.value ?? "PLAY_STORE_MODE_UNSPECIFIED"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Playプロテクトの設定を選択" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="BLACKLIST">
                  全アプリのパーミッションを強制的に有効
                </SelectItem>
                <SelectItem value="BLACKLIST">手動で設定変更可能</SelectItem>
                <SelectItem value="PLAY_STORE_MODE_UNSPECIFIED">
                  設定なし(デフォルト：手動で設定変更可能)
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>Playプロテクト設定を制御します。</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
