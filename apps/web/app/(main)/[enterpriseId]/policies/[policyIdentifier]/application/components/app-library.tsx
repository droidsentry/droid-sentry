import { PolicyApp } from "@/app/types/policy";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppLibraryMenu from "./app-library-menu";
import AppLibraryTitle from "./app-library-title";
import AppLibraryTool from "./app-library-tool";

import { Separator } from "@/components/ui/separator";
import AppLibraryBadge from "./app-library-badge";
import { useAppRestriction } from "./app-restriction-provider";
import Draggable from "./draggable";
import { Card } from "@/components/ui/card";

export default function AppLibrary({
  policyApps,
}: {
  policyApps: PolicyApp[];
}) {
  const {
    appRestrictionConfigs,
    filteredPolicyAppType,
    filteredPolicyAppTitle,
    filteredPolicyAppStatus,
  } = useAppRestriction();
  const filteredPolicyAppsType =
    filteredPolicyAppType === "ALL"
      ? policyApps
      : policyApps.filter((policyApp) => {
          return (
            policyApp.appType === filteredPolicyAppType //アプリ種別でフィルター
          );
        });
  const filteredPolicyAppsTitle = filteredPolicyAppsType.filter((policyApp) => {
    return policyApp.title
      .toLowerCase() // 小文字に変換
      .includes(filteredPolicyAppTitle.toLowerCase()); // フィルターされたタイトルを小文字に変換して含むかどうかをチェック
  });
  // Step 1: ステータスに基づいてappRestrictionConfigsをフィルタリング
  const getFilteredConfigs = () => {
    if (filteredPolicyAppStatus === "ALL") {
      return appRestrictionConfigs;
    }
    if (filteredPolicyAppStatus === "DISABLED") {
      return appRestrictionConfigs?.filter(
        (config) => config.disabled === true
      );
    }
    // DISABLED以外のステータスは installType で統一的にフィルタリング
    return appRestrictionConfigs?.filter(
      (config) => config.installType === filteredPolicyAppStatus
    );
  };
  const filteredConfigs = getFilteredConfigs();
  // Step 2: フィルタリングされたconfigsを使用してアプリをフィルタリング
  const filteredPolicyApps = filteredPolicyAppsTitle.filter((policyApp) => {
    if (filteredPolicyAppStatus === "ALL") return true;
    // filteredConfigsが存在しない場合は空の配列を返す
    return (filteredConfigs ?? []).some(
      (config) => config.packageName === policyApp.packageName
    );
  });

  return (
    <div className="flex flex-col rounded-lg">
      <AppLibraryTool filteredPolicyApps={filteredPolicyApps} />
      <div className="flex-1 mx-2 mb-2 min-w-0 relative">
        <div className="absolute size-full">
          <ScrollArea className=" rounded-lg border h-full">
            <div className="m-2 space-y-1">
              {filteredPolicyApps.map((policyApp) => (
                <Draggable
                  key={policyApp.appId}
                  policyApp={policyApp}
                  className="relative hover:shadow-md mb-2"
                >
                  <AppLibraryTitle policyApp={policyApp} />
                  <Separator orientation="vertical" className="h-10 mx-1" />
                  <AppLibraryBadge policyApp={policyApp} />
                  <AppLibraryMenu policyApp={policyApp} />
                </Draggable>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
