"use client";

import { AppsTableType } from "@/app/types/apps";
import { Loader2Icon } from "lucide-react";
import useSWR from "swr";
import { getApps } from "../data/fetch-enterprise-apps";
import { ManagementAppsColumns } from "./table/management-apps/management-apps-columns";
import ManagementAppsTable from "./table/management-apps/management-apps-table";

export default function ManagementAppsContent({
  data,
  enterpriseId,
}: {
  data: AppsTableType[];
  enterpriseId: string;
}) {
  const key = `/api/apps/${enterpriseId}`;
  const {
    data: apps,
    error,
    isValidating,
  } = useSWR<AppsTableType[]>(key, () => getApps(enterpriseId), {
    suspense: true,
    fallbackData: data,
    revalidateOnFocus: false, // タブ移動しても関数を実行しない
    revalidateIfStale: false, // 追加: キャッシュが古くても再検証しない
  });

  if (error) return <div>エラーが発生しました</div>;
  if (isValidating)
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2Icon className="animate-spin size-10 text-muted-foreground/50" />
        </div>
      </div>
    );
  if (!apps) return null;
  new Promise((resolve) => setTimeout(resolve, 10000));

  return (
    <ManagementAppsTable
      columns={ManagementAppsColumns}
      data={apps}
      isValidating={isValidating}
    />
  );
}
