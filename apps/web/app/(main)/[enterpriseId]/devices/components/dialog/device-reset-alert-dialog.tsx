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
import { resetDevices } from "../../actions/reset-devices";
import { Table } from "@tanstack/react-table";

interface DeviceResetAlertDialogProps<TData> {
  isResetDialogOpen: boolean;
  setIsResetDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  enterpriseId: string | null;
  deviceIdentifiers: string[];
  table?: Table<TData>;
}
export default function DeviceResetAlertDialog<TData>({
  isResetDialogOpen,
  setIsResetDialogOpen,
  enterpriseId,
  deviceIdentifiers,
  table,
}: DeviceResetAlertDialogProps<TData>) {
  const [initializationOption, setInitializationOption] = useState(
    "WIPE_DATA_FLAG_UNSPECIFIED"
  );
  const handleDeviceDelete = async () => {
    console.log("deviceIdentifiers", deviceIdentifiers);
    if (!enterpriseId || !deviceIdentifiers) {
      toast.error("端末初期化に失敗しました。");
      return;
    }
    toast.info("端末初期化中...");
    await resetDevices({
      enterpriseId,
      deviceIdentifiers,
      wipeDataFlags: [initializationOption],
    })
      .then(() => {
        toast.success("端末初期化を開始しました。");
        table?.resetRowSelection();
      })
      .catch((error) => {
        toast.error("端末初期化に失敗しました。");
        console.error("端末初期化に失敗しました。", error);
      })
      .finally(() => {
        setIsResetDialogOpen(false);
      });
  };
  return (
    <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
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
