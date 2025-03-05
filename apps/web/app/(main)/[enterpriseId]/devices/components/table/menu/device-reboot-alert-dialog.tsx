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
import { rebootDevices } from "../../../actions/reboot-device";
import { Table } from "@tanstack/react-table";

interface DeviceRebootAlertDialogProps<TData> {
  isRebootDialogOpen: boolean;
  setIsRebootDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  enterpriseId: string | null;
  deviceIdentifiers: string[];
  table?: Table<TData>;
}
export default function DeviceRebootAlertDialog<TData>({
  isRebootDialogOpen,
  setIsRebootDialogOpen,
  enterpriseId,
  deviceIdentifiers,
  table,
}: DeviceRebootAlertDialogProps<TData>) {
  const handleRemoteLookDevice = async () => {
    if (!enterpriseId || !deviceIdentifiers) {
      toast.error("端末再起動に失敗しました。");
      return;
    }
    await rebootDevices({
      deviceIdentifiers,
      enterpriseId,
    })
      .then(() => {
        toast.success("端末再起動を開始しました。");
        table?.resetRowSelection();
      })
      .catch((error) => {
        toast.error("端末再起動に失敗しました。");
        console.error("端末再起動に失敗しました。", error);
      })
      .finally(() => {
        setIsRebootDialogOpen(false);
      });
  };
  return (
    <AlertDialog open={isRebootDialogOpen} onOpenChange={setIsRebootDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当に端末再起動を開始してもよろしいでしょうか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            デバイスオーナーで管理されているデバイスのみ、端末再起動を実行できます。
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
