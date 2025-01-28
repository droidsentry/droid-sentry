import { PolicyApp } from "@/app/types/policy";
import Droppable from "./droppable";
import AppRestrictionZone from "./app-restriction-zone";
import { AppDetailSettings, RestrictedAppPackages } from "./app-restriction";
import { Button } from "@/components/ui/button";

export default function AppRestrictionManager({
  policyApps,
  restrictedAppPackages,
  setRestrictedAppPackages,
  setAppDetailSettings,
}: {
  policyApps: PolicyApp[];
  restrictedAppPackages: RestrictedAppPackages | null;
  setRestrictedAppPackages: React.Dispatch<
    React.SetStateAction<RestrictedAppPackages | null>
  >;
  setAppDetailSettings: React.Dispatch<React.SetStateAction<AppDetailSettings>>;
}) {
  const handleReset = () => {
    setRestrictedAppPackages({
      availableApps: [], // 利用可能なアプリケーションのパッケージ名
      restrictedApps: [], // 制限するアプリケーションのパッケージ名
    });
    setAppDetailSettings({});
  };
  return (
    <div className="border flex flex-col rounded-lg">
      <div className="basis-2/12 m-2 border rounded-lg shrink-0">
        <div className="flex items-center justify-center h-full ">
          アプリケーション管理
          <Button variant="outline" onClick={handleReset}>
            設定を全て解除
          </Button>
        </div>
      </div>
      {appManagements.map((appManagement) => (
        <Droppable
          key={appManagement.id}
          id={appManagement.id}
          className="relative basis-5/12 mx-2 mb-2 "
        >
          <AppRestrictionZone
            policyApps={policyApps}
            id={appManagement.id}
            restrictedAppPackages={restrictedAppPackages}
            setRestrictedAppPackages={setRestrictedAppPackages}
            setAppDetailSettings={setAppDetailSettings}
          />
        </Droppable>
      ))}
    </div>
  );
}

const appManagements = [
  { id: "availableApps", title: "利用可能なアプリケーション" },
  { id: "restrictedApps", title: "制限するアプリケーション" },
  // { id: "disabledApps", title: "アプリ無効化" },
] as const;
