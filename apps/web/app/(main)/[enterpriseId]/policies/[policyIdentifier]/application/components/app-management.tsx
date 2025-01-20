"use client";

import { Apps } from "@/app/types/policy";
import AppDropZone from "./app-drop-zone";

export default function AppManagement({ apps }: { apps: Apps[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">アプリケーション管理</h2>
      {APP_ZONES.map((zone) => (
        <AppDropZone
          key={zone.id}
          apps={apps}
          id={zone.id}
          title={zone.title}
          filterCondition={zone.filterCondition}
        />
      ))}
    </div>
  );
}

const APP_ZONES = [
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
