"use client";

import { Apps } from "@/app/types/policy";
import AppDropZone from "./app-drop-zone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Droppable from "./droppable";

export default function AppManagement({
  apps,
  className,
}: {
  apps: Apps[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 h-full", className)}>
      <h2 className="text-2xl font-bold pb-28">アプリケーション管理</h2>
      <div className="flex flex-col h-full items-stretch space-y-2">
        {appAlias.map((zone) => (
          <Droppable key={zone.id} id={zone.id} className="h-1/3">
            <AppDropZone
              key={zone.id}
              apps={apps}
              title={zone.title}
              filterCondition={zone.filterCondition}
              className="h-full"
            />
          </Droppable>
        ))}
      </div>
    </div>
  );
}

const appAlias = [
  {
    id: "availableApps",
    title: "利用可能アプリ",
    filterCondition: (app: Apps) =>
      app.installType === "FORCE_INSTALLED" && !app.disabled,
  },
  {
    id: "restrictedApps",
    title: "インストール不可",
    filterCondition: (app: Apps) =>
      app.installType === "BLOCKED" && !app.disabled,
  },
  {
    id: "disabledApps",
    title: "アプリ無効化",
    filterCondition: (app: Apps) =>
      app.installType !== "BLOCKED" && app.disabled === true,
  },
] as const;
