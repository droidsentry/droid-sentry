"use client";

import { Apps } from "@/app/types/policy";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import AppCard from "./app-card";
import Draggable from "./draggable";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ApplicationLibrary({ apps }: { apps: Apps[] }) {
  const [filterApps, setFilterApps] = useState("");
  const [appType, setAppType] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredApps = apps.filter((app) => {
    return (
      app.title.toLowerCase().includes(filterApps.toLowerCase()) && // アプリ名でフィルタリング
      (appType === "all" || app.appType === appType) && // アプリ種別でフィルタリング
      (status === "all" ||
        (status === "disabled"
          ? app.disabled
          : (status === "UNSET" && !app.installType) || // installTypeが未設定の場合
            app.installType === status))
    );
  });

  return (
    <div className="flex flex-col">
      <div className="space-y-4 mb-4 ">
        <h2 className="text-2xl font-bold">アプリケーション一覧</h2>
        <div className="flex flex-wrap gap-2">
          <Input
            type="text"
            placeholder="アプリケーション名を検索"
            value={filterApps}
            onChange={(e) => setFilterApps(e.target.value)}
          />
          <Select value={appType} onValueChange={setAppType}>
            <SelectTrigger className="w-1/3">
              <SelectValue placeholder="アプリ種別" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全てのアプリ種類</SelectItem>
              <SelectItem value="PUBLIC">Google Play</SelectItem>
              <SelectItem value="PRIVATE">限定公開</SelectItem>
              <SelectItem value="WEB">WEB</SelectItem>
              <SelectItem value="CUSTOM">カスタム</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-1/3">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全てのステータス</SelectItem>
              <SelectItem value="UNSET">未設定</SelectItem>
              <SelectItem value="FORCE_INSTALLED">
                利用可能(自動インストール)
              </SelectItem>
              <SelectItem value="BLOCKED">インストール不可</SelectItem>
              <SelectItem value="AVAILABLE">
                利用可能(手動インストール)
              </SelectItem>
              <SelectItem value="disabled">アプリ無効</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 min-w-0 relative">
        <div className="absolute size-full">
          <ScrollArea className="h-full gap-2 pr-3 overflow-y-auto overflow-x-hidden">
            {filteredApps.map((app) => (
              <Draggable key={app.appId} app={app}>
                <AppCard app={app} />
              </Draggable>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
