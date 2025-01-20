"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteSelectedDevices } from "../data/delete-devices";
import { DeviceTableType } from "@/app/types/device";
import { RouteParams } from "@/app/types/enterprise";
import { useParams } from "next/navigation";

interface DeleteSelectedDevicesButtonProps<TData> {
  table: Table<TData>;
}

export default function DeleteSelectedDevicesButton<TData>({
  table,
}: DeleteSelectedDevicesButtonProps<TData>) {
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;
  const [isPending, startTransition] = useTransition();
  const handleDeleteApps = async () => {
    const deviceIdentifiers = table
      .getSelectedRowModel()
      .rows.map((row) => {
        const deviceData = row.original as DeviceTableType;
        return deviceData.deviceIdentifier;
      })
      .filter((identifier): identifier is string => Boolean(identifier));

    startTransition(async () => {
      toast.info("デバイスを削除中...");
      await deleteSelectedDevices({
        enterpriseId,
        deviceIdentifiers,
        wipeDataFlags: ["WIPE_DATA_FLAG_UNSPECIFIED"],
      })
        .then(async () => {
          toast.success("選択したデバイスを削除しました。");
        })
        .catch((error) => {
          toast.error(error.message);
        });
      table.resetRowSelection();
    });
  };

  return (
    <Button
      variant="outline"
      className="h-8"
      onClick={handleDeleteApps}
      disabled={isPending}
      size="icon"
    >
      {isPending ? (
        <>
          <Loader2Icon className="size-4 animate-spin" />
          <span className="sr-only">選択したアプリを削除中</span>
        </>
      ) : (
        <>
          <Trash2Icon className="size-4 text-red-500" />
          <span className="sr-only">選択したアプリを削除</span>
        </>
      )}
    </Button>
  );
}
