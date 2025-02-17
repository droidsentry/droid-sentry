"use client";

import { AppsTableType, AppType } from "@/app/types/apps";
import { Loader2Icon } from "lucide-react";
import useSWR from "swr";
import { appsColumns } from "../../components/table/apps-columns";
import AppsTable from "../../components/table/apps-table";
import { getApps } from "../../actions/fetch-enterprise-apps";

export default function WebAppsContent({
  data,
  enterpriseId,
  appType,
}: {
  data: AppsTableType[];
  enterpriseId: string;
  appType: AppType;
}) {
  const key = `/api/apps/${enterpriseId}/${appType}`;
  const {
    data: apps,
    error,
    isValidating,
  } = useSWR<AppsTableType[]>(key, () => getApps(enterpriseId, appType), {
    suspense: true,
    fallbackData: data,
    revalidateOnFocus: false, // タブ移動しても関数を実行しない
    revalidateIfStale: false, // 追加: キャッシュが古くても再検証しない
  });

  if (error) return <div>エラーが発生しました</div>;
  if (isValidating)
    return (
      <div className=" relative w-[330px] h-full rounded-lg overflow-hidden">
        <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2Icon className="animate-spin size-10 text-muted-foreground/30" />
        </div>
      </div>
    );
  if (!apps) return null;

  return <AppsTable columns={appsColumns} data={apps} />;
}
