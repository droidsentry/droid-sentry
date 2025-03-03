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
import { rebootDevice } from "../../../actions/reboot-device";

export default function DeviceRebootAlertDialog({
  isRebootDialogOpen,
  setIsRebootDialogOpen,
  enterpriseId,
  deviceIdentifier,
}: {
  isRebootDialogOpen: boolean;
  setIsRebootDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  enterpriseId: string | null;
  deviceIdentifier: string | null;
}) {
  const handleRemoteLookDevice = async () => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("端末再起動に失敗しました。");
      return;
    }
    await rebootDevice({
      deviceIdentifier,
      enterpriseId,
    })
      .then(() => {
        toast.success("端末再起動を開始しました。");
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
