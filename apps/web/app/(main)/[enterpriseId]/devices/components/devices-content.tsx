"use client";

import { Loader2Icon } from "lucide-react";
import { DeviceTableType } from "@/app/types/device";
import useSWR from "swr";
import { getDevicesData } from "../data/device";
import DeviceTable from "./device-table";
import { deviceColumns } from "./devices-table-columns";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

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
    mutate,
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
  const supabase = createClient();
  useEffect(() => {
    const currentUrl = window.location.href;
    // 本番環境かどうか
    const env = process.env.NODE_ENV;
    const isProduction = env === "production";
    // URLがlocalhostかどうか
    const isLocalhost = currentUrl.includes("localhost");
    if (!isProduction && !isLocalhost) return;

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

    // 60分後にunsubscribeするタイマーを設定
    const timer = setTimeout(
      () => {
        enterpriseDevices.unsubscribe();
        console.log("60分経過: リアルタイム購読を解除しました");
      },
      60 * 60 * 1000
    ); // 60分 = 60 * 60 * 1000ミリ秒

    return () => {
      clearTimeout(timer); // コンポーネントのアンマウント時にタイマーをクリア
      enterpriseDevices.unsubscribe();
    };
  }, [enterpriseId, mutate]);
  if (error) return <div>エラーが発生しました</div>;
  // if (isValidating)
  //   return (
  //     <div className="relative w-full h-full rounded-lg overflow-hidden">
  //       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
  //         <Loader2Icon className="animate-spin size-10 text-muted-foreground/50" />
  //       </div>
  //     </div>
  //   );
  if (!devices) return null;

  return (
    <DeviceTable
      columns={deviceColumns}
      data={devices}
      enterpriseId={enterpriseId}
    />
  );
}
