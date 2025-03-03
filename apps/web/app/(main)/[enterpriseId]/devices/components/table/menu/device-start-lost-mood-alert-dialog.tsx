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
import { remoteLookDevice } from "../../../actions/remote-look-device";
import { startLostModeSelectedDevice } from "../../../actions/lost-mode-devices";
import { useState } from "react";

export default function DeviceStartLostModeAlertDialog({
  isStartLostModeDialogOpen,
  setIsStartLostModeDialogOpen,
  enterpriseId,
  deviceIdentifier,
}: {
  isStartLostModeDialogOpen: boolean;
  setIsStartLostModeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  enterpriseId: string | null;
  deviceIdentifier: string | null;
}) {
  const handleStartLostMode = async () => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("紛失モードに失敗しました。");
      return;
    }

    await startLostModeSelectedDevice(enterpriseId, deviceIdentifier)
      .then(() => {
        toast.success("紛失モードを有効にしました");
        // setIsLostMode(true);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // const handleStopLostMode = async () => {
  //   if (!enterpriseId || !deviceIdentifier) {
  //     toast.error("紛失モードの解除に失敗しました。");
  //     return;
  //   }
  //   await stopLostModeSelectedDevice(enterpriseId, deviceIdentifier)
  //     .then(() => {
  //       toast.success("紛失モードを無効にしました");
  //       setIsLostMode(false);
  //     })
  //     .catch((error) => {
  //       toast.error(error.message);
  //     });
  // };
  return (
    <AlertDialog
      open={isStartLostModeDialogOpen}
      onOpenChange={setIsStartLostModeDialogOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当に紛失モードを開始してもよろしいでしょうか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            画面ロックが設定されていないデバイスは、紛失モード画面は表示されますが、画面ロックは実行されません。
            画面ロックを設定する場合は、パスワードリセットをご利用ください。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleStartLostMode}>
            紛失モードを開始
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
