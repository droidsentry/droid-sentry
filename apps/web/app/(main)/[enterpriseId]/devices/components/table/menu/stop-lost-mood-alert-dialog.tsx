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
import { stopLostModeSelectedDevice } from "../../../actions/lost-mode-devices";
import { DeviceTableType } from "@/lib/types/device";

export default function StopLostModeAlertDialog({
  isStopLostModeDialogOpen,
  setIsStopLostModeDialogOpen,
  enterpriseId,
  devices,
}: {
  isStopLostModeDialogOpen: boolean;
  setIsStopLostModeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  enterpriseId: string | null;
  devices: DeviceTableType[];
}) {
  const handleStopLostMode = async () => {
    if (!enterpriseId) {
      toast.error("紛失モードの解除に失敗しました。");
      return;
    }
    await stopLostModeSelectedDevice(enterpriseId, devices)
      .then(() => {
        toast.success("紛失モードを解除しました");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <AlertDialog
      open={isStopLostModeDialogOpen}
      onOpenChange={setIsStopLostModeDialogOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当に紛失モードを解除してもよろしいでしょうか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            紛失モードを解除すると、紛失モード画面は表示されなくなります。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleStopLostMode}>
            紛失モードを解除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
