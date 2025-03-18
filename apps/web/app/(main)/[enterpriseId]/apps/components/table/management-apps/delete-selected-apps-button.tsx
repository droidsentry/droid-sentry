"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Loader2Icon, Trash2Icon } from "lucide-react";

import { AppsTableType } from "@/lib/types/apps";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteApps } from "@/lib/actions/emm/app";

interface DeleteSelectedAppsButtonProps<TData> {
  table: Table<TData>;
}

export default function DeleteSelectedAppsButton<TData>({
  table,
}: DeleteSelectedAppsButtonProps<TData>) {
  const param = useParams<{ enterpriseId: string }>();
  const enterpriseId = param.enterpriseId;
  const [isPending, startTransition] = useTransition();
  const handleDeleteApps = async () => {
    const deleteAppIdList = table.getSelectedRowModel().rows.map((row) => {
      const appData = row.original as AppsTableType;
      return appData.appId;
      // return row.getValue("パッケージ名") as string;
    });
    toast.info("アプリを削除中...");
    startTransition(async () => {
      await deleteApps(enterpriseId, deleteAppIdList)
        .then(async () => {
          toast.success("選択したアプリ情報を削除しました。");
          table.resetRowSelection();
        })
        .catch((error) => {
          toast.error(error.message);
        });
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
