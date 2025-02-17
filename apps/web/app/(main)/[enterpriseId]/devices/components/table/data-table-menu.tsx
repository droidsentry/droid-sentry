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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Ban,
  CaptionsOff,
  Download,
  EllipsisIcon,
  Key,
  Lock,
  RefreshCw,
  Smartphone,
  Trash2,
  Vibrate,
  VibrateOffIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import { DeviceTableType } from "@/app/types/device";
import { Row } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  startLostModeSelectedDevice,
  stopLostModeSelectedDevice,
} from "../../actions/lost-mode-devices";

import { RouteParams } from "@/app/types/enterprise";
import { deleteDevice } from "../../data/delete-devices";
import { syncDeviceInfoFromDB } from "../../data/device";

interface DataTableMenuProps {
  row: Row<DeviceTableType>;
}

export default function DataTableMenu({ row }: DataTableMenuProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initializationOption, setInitializationOption] = useState(
    "WIPE_DATA_FLAG_UNSPECIFIED"
  );
  const [isLostMode, setIsLostMode] = useState(false);
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;
  const router = useRouter();

  const handleDeviceInfo = async (deviceIdentifier: string | null) => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("デバイス情報は確認できません。");
      return;
    }
    router.push(`/${enterpriseId}/devices/${deviceIdentifier}/base-info`);
  };

  const handleSyncDeviceInfo = async (deviceIdentifier: string | null) => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("デバイス情報の取得に失敗しました。");
      return;
    }
    await syncDeviceInfoFromDB({
      deviceIdentifier,
      enterpriseId,
    }).catch((error) => {
      toast.error("デバイス情報の取得に失敗しました。");
      console.error("デバイス情報の取得に失敗しました。", error);
    });
  };

  const handleDeviceAction = async (deviceIdentifier: string | null) => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("失敗しました。");
      return;
    }
    console.log(deviceIdentifier);
  };

  const handleStartLostMode = async (deviceIdentifier: string | null) => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("紛失モードに失敗しました。");
      return;
    }

    await startLostModeSelectedDevice(enterpriseId, deviceIdentifier)
      .then(() => {
        toast.success("紛失モードを有効にしました");
        setIsLostMode(true);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleStopLostMode = async (deviceIdentifier: string | null) => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("紛失モードの解除に失敗しました。");
      return;
    }
    await stopLostModeSelectedDevice(enterpriseId, deviceIdentifier)
      .then(() => {
        toast.success("紛失モードを無効にしました");
        setIsLostMode(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleDeviceDelete = async (
    wipeDataFlag: string,
    deviceIdentifier: string | null
  ) => {
    if (!enterpriseId || !deviceIdentifier) {
      toast.error("紛失モードの解除に失敗しました。");
      return;
    }
    toast.info("デバイスを削除中...");
    await deleteDevice({
      enterpriseId,
      deviceIdentifier,
      wipeDataFlags: [wipeDataFlag],
    })
      .then(() => {
        toast.success("デバイスを削除しました。");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisIcon className="size-4" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" space-y-1 px-2" align="end">
          <DropdownMenuItem
            onSelect={() => handleDeviceInfo(row.original.deviceIdentifier)}
          >
            <Smartphone className="mr-4 size-4" />
            <span>デバイス詳細</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleSyncDeviceInfo(row.original.deviceIdentifier)}
          >
            <Download className="mr-4 size-4" />
            <span>デバイス情報取得</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              handleDeviceAction(row.original.deviceIdentifier ?? "")
            }
          >
            <Lock className="mr-4 size-4" />
            <span>リモートロック</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDeviceAction(row.original.deviceIdentifier)}
          >
            <Key className="mr-4 size-4" />
            <span>パスワードリセット</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDeviceAction(row.original.deviceIdentifier)}
          >
            <RefreshCw className="mr-4 size-4" />
            <span>端末再起動</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDeviceAction(row.original.deviceIdentifier)}
          >
            <CaptionsOff className="mr-4 size-4" />
            <span>アプリデータ削除</span>
          </DropdownMenuItem>
          {isLostMode ? (
            <DropdownMenuItem
              onSelect={() => handleStopLostMode(row.original.deviceIdentifier)}
            >
              <VibrateOffIcon className="mr-4 size-4" />
              <span>紛失モード停止</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={() =>
                handleStartLostMode(row.original.deviceIdentifier)
              }
            >
              <Vibrate className="mr-4 size-4" />
              <span>紛失モード</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
            <Ban className="mr-4 size-4" />
            <span className="text-red-500">端末初期化</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
              onClick={() =>
                handleDeviceDelete(
                  initializationOption,
                  row.original.deviceIdentifier
                )
              }
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
