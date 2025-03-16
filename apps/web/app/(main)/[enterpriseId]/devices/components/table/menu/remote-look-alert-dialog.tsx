"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { remoteLookDevices } from "../../../actions/remote-look-device";
import { Table } from "@tanstack/react-table";
import { DeviceTableType } from "@/app/types/device";

interface RemoteLookAlertDialogProps<TData> {
  isRemoteLookDialogOpen: boolean;
  setIsRemoteLookDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  enterpriseId: string | null;
  devices: DeviceTableType[];
  table?: Table<TData>;
}
export default function RemoteLookAlertDialog<TData>({
  isRemoteLookDialogOpen,
  setIsRemoteLookDialogOpen,
  enterpriseId,
  devices,
  table,
}: RemoteLookAlertDialogProps<TData>) {
  const handleRemoteLookDevice = async () => {
    if (!enterpriseId) {
      toast.error("デバイスのロックに失敗しました。");
      return;
    }
    await remoteLookDevices({
      devices,
      enterpriseId,
    })
      .then(() => {
        toast.success("デバイスをロックしました。");
        table?.resetRowSelection();
      })
      .catch((error) => {
        toast.error("デバイスのロックに失敗しました。");
        console.error("デバイスのロックに失敗しました。", error);
      })
      .finally(() => {
        setIsRemoteLookDialogOpen(false);
      });
  };
  return (
    <AlertDialog
      open={isRemoteLookDialogOpen}
      onOpenChange={setIsRemoteLookDialogOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当にリモートロックを開始してもよろしいでしょうか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            画面ロックが設定されていないデバイスは、画面消灯のみ実行されます。
            画面ロックを設定していないデバイスをパスワード付きで画面ロックする場合は、バスワードリセットをご利用ください。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoteLookDevice}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
