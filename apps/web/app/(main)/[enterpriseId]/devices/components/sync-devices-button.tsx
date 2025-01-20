"use client";

import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { syncDevicesWithGoogle } from "../data/device-google";

export default function SyncDevicesButton({
  enterpriseId,
}: {
  enterpriseId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const handleClick = async () => {
    startTransition(async () => {
      const data = await syncDevicesWithGoogle(enterpriseId);
      // mutate(key, data, false);
      console.log("Devices data", data);
    });
  };

  // console.log("policiesData", policiesData);
  return (
    <Button
      variant="outline"
      className=" h-8 hidden lg:flex"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 animate-spin" />
          同期中...
        </>
      ) : (
        "Googleサーバーと同期 (リリースする時は削除するボタン)"
      )}
    </Button>
  );
}
