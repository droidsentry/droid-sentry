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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { toast } from "sonner";
import { deleteDevice } from "../../../data/delete-devices";

export default function DeviceResetAlertDialog({
  isDialogOpen,
  setIsDialogOpen,
  enterpriseId,
  deviceIdentifier,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  enterpriseId: string | null;
  deviceIdentifier: string | null;
}) {
  const [initializationOption, setInitializationOption] = useState(
    "WIPE_DATA_FLAG_UNSPECIFIED"
  );
  const handleDeviceDelete = async () => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("紛失モードの解除に失敗しました。");
      return;
    }
    toast.info("デバイスを削除中...");
    await deleteDevice({
      enterpriseId,
      deviceIdentifier,
      wipeDataFlags: [initializationOption],
    })
      .then(() => {
        toast.success("デバイスを削除しました。");
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsDialogOpen(false);
      });
  };
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            本当に初期化してもよろしいでしょうか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            初期化のオプションを選択してください。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <RadioGroup
          value={initializationOption}
          onValueChange={setInitializationOption}
          className="space-y-1"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem
              value="WIPE_DATA_FLAG_UNSPECIFIED"
              id="WIPE_DATA_FLAG_UNSPECIFIED"
            />
            <Label htmlFor="WIPE_DATA_FLAG_UNSPECIFIED">
              デバイスプロテクションを解除し初期化
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem
              value="WIPE_EXTERNAL_STORAGE"
              id="WIPE_EXTERNAL_STORAGE"
            />
            <Label htmlFor="WIPE_EXTERNAL_STORAGE">
              デバイスプロテクションを解除し初期化（外部ストレージも削除）
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem
              value="PRESERVE_RESET_PROTECTION_DATA"
              id="PRESERVE_RESET_PROTECTION_DATA"
            />
            <Label htmlFor="PRESERVE_RESET_PROTECTION_DATA">
              デバイスプロテクション有効を維持し初期化
            </Label>
          </div>
        </RadioGroup>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            disabled={!initializationOption}
            onClick={handleDeviceDelete}
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
