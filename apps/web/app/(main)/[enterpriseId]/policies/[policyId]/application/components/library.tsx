import { PolicyApp } from "@/lib/types/policy";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppLibraryMenu from "./library-menu";
import AppLibraryTitle from "./library-title";
import AppLibraryTool from "./library-tool";

import { Separator } from "@/components/ui/separator";
import AppLibraryBadge from "./library-badge";
import { useAppRestriction } from "./restriction-provider";
import Draggable from "./draggable";

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
    <div className="flex flex-col rounded-lg ">
      <AppLibraryTool filteredPolicyApps={filteredPolicyApps} />
      <div className="flex-1 min-w-0 relative">
        <div className="absolute size-full ">
          <ScrollArea className="rounded-lg h-full">
            <div className="mx-2">
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
