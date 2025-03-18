import { PolicyApp } from "@/lib/types/policy";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { List, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PolicyAppStatus, useAppRestriction } from "./restriction-provider";

export default function AppLibraryMenu({
  policyApp,
}: {
  policyApp: PolicyApp;
}) {
  const [open, setOpen] = useState(false);
  const {
    setRestrictedAppPackages,
    setAppRestrictionConfigs,
    appRestrictionConfigs,
  } = useAppRestriction();
  const targetAppPackageName = policyApp.packageName;
  // appRestrictionConfigsが存在し、かつ対象アプリの設定が存在するかチェック
  const isConfigAvailable = !!appRestrictionConfigs;
  const hasAppConfig =
    isConfigAvailable &&
    appRestrictionConfigs.find(
      (config) => config.packageName === targetAppPackageName
    ) !== undefined;
  // アプリがBLOCKED状態かどうかを確認
  const isBlocked =
    hasAppConfig &&
    appRestrictionConfigs?.find(
      (config) => config.packageName === targetAppPackageName
    )?.installType === "BLOCKED";

  const getPositionFromConfig = (configs: typeof appRestrictionConfigs) => {
    const config = configs?.find(
      (config) => config.packageName === targetAppPackageName
    );
    if (!config) return "FORCE_INSTALLED";
    if (config.disabled) return "DISABLED";
    return config.installType || "FORCE_INSTALLED";
  };

  // 初期値の設定
  const initialPosition = getPositionFromConfig(appRestrictionConfigs);
  const [position, setPosition] = useState(initialPosition);

  // appRestrictionConfigsの変更を監視してpositionを更新
  useEffect(() => {
    const newPosition = getPositionFromConfig(appRestrictionConfigs);
    setPosition(newPosition);
  }, [appRestrictionConfigs]);

  const handleRemoveApp = () => {
    // ドラック&ドロップの場所を更新
    setRestrictedAppPackages((prev) => {
      if (!prev) return prev;
      const newRestrictedAppPackages = {
        ...prev,
        availableApps: prev.availableApps.filter(
          (packageName) => packageName !== targetAppPackageName
        ),
        restrictedApps: prev.restrictedApps.filter(
          (packageName) => packageName !== targetAppPackageName
        ),
      };
      return newRestrictedAppPackages;
    });
    setAppRestrictionConfigs((prev) => {
      if (!prev) return prev;
      let newAppRestrictionConfigs = [...prev];
      newAppRestrictionConfigs = newAppRestrictionConfigs.filter(
        (config) => config.packageName !== targetAppPackageName
      );
      return newAppRestrictionConfigs;
    });
  };
  const handleChangeAppStatus = (value: PolicyAppStatus) => {
    setAppRestrictionConfigs((prev) => {
      if (!prev) return prev;
      let updatedConfigs = [...prev];

      // value が KIOSK の場合は, 他のアプリの KIOSK 設定を解除する
      if (value === "KIOSK") {
        updatedConfigs = updatedConfigs.map((config) => {
          if (config.installType === "KIOSK") {
            return {
              ...config,
              installType: "FORCE_INSTALLED",
              disabled: false,
            };
          }
          return config;
        });
      }
      // 対象アプリの設定を更新
      const targetConfig = updatedConfigs.find(
        (config) => config.packageName === targetAppPackageName
      );

      if (targetConfig) {
        // 既存の設定を更新
        return updatedConfigs.map((config) =>
          config.packageName === targetAppPackageName
            ? {
                ...config,
                ...(value === "DISABLED"
                  ? { installType: null, disabled: true }
                  : { installType: value, disabled: false }),
              }
            : config
        );
      } else {
        // 新規設定を追加
        return [
          ...updatedConfigs,
          {
            packageName: targetAppPackageName,
            ...(value === "DISABLED"
              ? { installType: null, disabled: true }
              : { installType: value, disabled: false }),
          },
        ];
      }
    });
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="z-10"
          disabled={!hasAppConfig}
        >
          <List className="size-4 mx-2" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-space-y-1 px-2" align="end">
          <div className="flex items-center justify-between">
            <DropdownMenuItem
              onClick={handleRemoveApp}
              className="w-full flex items-center justify-center"
            >
              <RefreshCw className="mr-4 size-4" />
              <span>設定をリセット</span>
            </DropdownMenuItem>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setOpen(false)}
            >
              <X className="" />
            </Button>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={position}
            onValueChange={(value) => {
              console.log("value", value);
              if (value === "KIOSK") {
                return;
              }
              setPosition(value);
              handleChangeAppStatus(value as PolicyAppStatus);
            }}
          >
            <DropdownMenuRadioItem
              value="FORCE_INSTALLED"
              onSelect={(e) => e.preventDefault()}
              disabled={isBlocked}
            >
              強制インストール(手動削除不可)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="PREINSTALLED"
              onSelect={(e) => e.preventDefault()}
              disabled={isBlocked}
            >
              自動インストール(手動削除可)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="AVAILABLE"
              onSelect={(e) => e.preventDefault()}
              disabled={isBlocked}
            >
              利用可能(手動削除可)
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              value="DISABLED"
              onSelect={(e) => e.preventDefault()}
              disabled={isBlocked}
            >
              アプリ無効(アプリデータは保持)
            </DropdownMenuRadioItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuRadioItem
                  value="KIOSK"
                  onSelect={(e) => e.preventDefault()}
                  disabled={isBlocked}
                >
                  キオスクモード(手動削除不可)
                </DropdownMenuRadioItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    対象アプリをキオスクモードに設定しますか？
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    キオスクモードに設定すると、対象アプリは自動インストールされ、手動削除不可となります。
                    対象のアプリがインストール完了するまで、ユーザー操作を受け付けません。
                    他のアプリがキオスクモードに設定されている場合は、自動で設定が解除されます。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                  // onClick={() => setPosition(previousPosition)}
                  >
                    キャンセル
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setPosition("KIOSK");
                      handleChangeAppStatus("KIOSK");
                    }}
                  >
                    設定を進める
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
