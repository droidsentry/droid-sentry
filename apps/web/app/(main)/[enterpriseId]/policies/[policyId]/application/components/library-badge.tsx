import { PolicyApp } from "@/lib/types/policy";
import { Badge } from "@/components/ui/badge";
import { useAppRestriction } from "./restriction-provider";

export default function AppLibraryBadge({
  policyApp,
}: {
  policyApp: PolicyApp;
}) {
  const { appRestrictionConfigs } = useAppRestriction();
  // アプリの設定を1回だけ検索
  const appConfig = appRestrictionConfigs?.find(
    (config) => config.packageName === policyApp.packageName
  );

  // 設定が存在しない場合は何も表示しない
  if (!appConfig) return null;
  // バッジの種類とテキストを決定する関数
  const getBadgeInfo = () => {
    const { installType, disabled } = appConfig;

    switch (installType) {
      case "BLOCKED":
        return {
          variant: "destructive" as const,
          text: "インストール制限(強制アンインストール)",
        };
      case "FORCE_INSTALLED":
        return {
          variant: "secondary" as const,
          text: "強制インストール(手動削除不可)",
        };
      case "PREINSTALLED":
        return {
          variant: "secondary" as const,
          text: "自動インストール(手動削除可)",
        };
      case "AVAILABLE":
        return {
          variant: "secondary" as const,
          text: "利用可能(手動削除可)",
        };
      case "KIOSK":
        return {
          variant: "secondary" as const,
          text: "キオスクモード(手動削除不可)",
        };
      default:
        // installTypeが上記以外の場合は、disabledフラグをチェック
        if (disabled) {
          return {
            variant: "secondary" as const,
            text: "アプリ無効",
          };
        }
        return null;
    }
  };

  const badgeInfo = getBadgeInfo();
  if (!badgeInfo) return null;

  return (
    <div>
      <Badge variant={badgeInfo.variant} className="whitespace-nowrap shrink-0">
        {badgeInfo.text}
      </Badge>
    </div>
  );
}
