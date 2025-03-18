"use client";

import { DeviceTableType } from "@/lib/types/device";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { getDevicesData } from "../actions/device";
import DeviceTable from "./table/device-table";
import { deviceColumns } from "./table/table-columns";

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
    mutate,
  } = useSWR<DeviceTableType[]>(
    key,
    () => {
      return getDevicesData({ enterpriseId });
    },
    {
      fallbackData: data,
      // dedupingInterval: 3600000, // enterpriseIdが同じ場合は1時間、関数を実行しない
      revalidateOnFocus: false, // タブ移動しても関数を実行しない
      revalidateIfStale: false, // 追加: キャッシュが古くても再検証しない ※画面のレンダリング時のデータ更新を防ぐため
      // revalidateOnMount: true, //  コンポーネントマウント時に必ず再検証
      // keepPreviousData: false, // 前のデータを保持しない
    }
  );
  const supabase = createClient();
  useEffect(() => {
    const currentUrl = window.location.href;
    // 本番環境かどうか
    const env = process.env.NODE_ENV;
    const isProduction = env === "production";
    // URLがlocalhostかどうか
    const isLocalhost = currentUrl.includes("localhost");
    if (!isProduction && !isLocalhost) {
      console.log("currentUrl", currentUrl);
      console.log(
        "localhost or production 以外は、デバイステーブルをリアルタイムに監視しません。"
      );
      return;
    }

    const enterpriseDevices = supabase.channel(enterpriseId);
    enterpriseDevices
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "devices",
          filter: `enterprise_id=eq.${enterpriseId}`,
        },
        (payload) => {
          console.log("payload", payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "devices",
          filter: `enterprise_id=eq.${enterpriseId}`,
        },
        (payload) => {
          console.log("payload", payload);
          toast.info("デバイスが更新されました。");
          mutate();
        }
      )
      .subscribe();

    return () => {
      enterpriseDevices.unsubscribe();
    };
  }, [enterpriseId, mutate]);
  if (error) return <div>エラーが発生しました</div>;
  if (!devices) return null;

  return (
    <DeviceTable
      columns={deviceColumns}
      data={devices}
      enterpriseId={enterpriseId}
    />
  );
}
