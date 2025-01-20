"use client";

import { Loader2Icon } from "lucide-react";
import { DeviceTableType } from "@/app/types/device";
import useSWR from "swr";
import { getDevicesData } from "../data/device";
import DeviceTable from "./device-table";
import { deviceColumns } from "./devices-table-columns";

export default function DevicesContent({
  data,
  enterpriseId,
}: {
  data: DeviceTableType[];
  enterpriseId: string;
}) {
  const key = "/api/devices";
  const {
    data: devices,
    error,
    // isLoading,
    // mutate,
    isValidating,
  } = useSWR<DeviceTableType[]>(
    key,
    () => {
      // console.log("run");
      return getDevicesData({ enterpriseId });
    },
    {
      // suspense: true,
      fallbackData: data,
      // dedupingInterval: 3600000, // enterpriseIdが同じ場合は1時間、関数を実行しない
      revalidateOnFocus: false, // タブ移動しても関数を実行しない
      revalidateIfStale: false, // 追加: キャッシュが古くても再検証しない ※画面のレンダリング時のデータ更新を防ぐため
      // revalidateOnMount: true, //  コンポーネントマウント時に必ず再検証
      // keepPreviousData: false, // 前のデータを保持しない
    }
  );
  if (error) return <div>エラーが発生しました</div>;
  if (isValidating)
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2Icon className="animate-spin size-10 text-muted-foreground/50" />
        </div>
      </div>
    );
  if (!devices) return null;

  return (
    <DeviceTable
      columns={deviceColumns}
      data={devices}
      enterpriseId={enterpriseId}
    />
  );
}
