"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteSelectedDevices } from "../actions/delete-selected-devices";
import { DeviceTableType } from "@/app/types/device";
import { RouteParams } from "@/app/types/enterprise";
import { useParams } from "next/navigation";
import TitleTooltip from "@/components/title-tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteSelectedDevicesButtonProps<TData> {
  table: Table<TData>;
  isSelected: boolean;
}

export default function DeleteSelectedDevicesButton<TData>({
  table,
  isSelected,
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
    <TitleTooltip tooltip="選択したデバイスを削除する">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            disabled={isPending || !isSelected}
            size="icon"
            tabIndex={isSelected ? 0 : -1}
          >
            {isPending ? (
              <>
                <Loader2Icon className="size-6 animate-spin" />
                <span className="sr-only">選択したアプリを削除中</span>
              </>
            ) : (
              <>
                <Trash2Icon className="size-6" />
                <span className="sr-only">選択したアプリを削除</span>
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              選択したデバイス情報を完全に削除します。
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col space-y-2">
              <span>
                この操作を実行すると、選択されたデバイスを初期化し、デバイス情報、ログなどが完全に削除されます。
                デバイスは、デバイスプロテクションが解除された状態で初期化が実行されます。
              </span>
              <span>
                デバイスの初期化のみを実施する場合は、デバイス一覧の個別のメニューから「端末初期化」を実行してください。
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteApps}>
              デバイスを削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TitleTooltip>
  );
}
