import { PolicyApp } from "@/app/types/policy";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppLibraryMenu from "./app-library-menu";
import AppLibraryTitle from "./app-library-title";
import AppLibraryTool from "./app-library-tool";
import {
  PolicyAppStatus,
  PolicyAppType,
  RestrictedAppPackages,
} from "./app-restriction";
import Draggable from "./draggable";

export default function AppLibrary({
  policyApps,
  restrictedAppPackages,
  setRestrictedAppPackages,
  selectedPolicyAppPackages,
  setSelectedPolicyAppPackages,
  filteredPolicyAppType,
  setFilteredPolicyAppType,
  filteredPolicyAppTitle,
  setFilteredPolicyAppTitle,
  filteredPolicyAppStatus,
  setFilteredPolicyAppStatus,
}: {
  policyApps: PolicyApp[];
  restrictedAppPackages: RestrictedAppPackages | null;
  setRestrictedAppPackages: React.Dispatch<
    React.SetStateAction<RestrictedAppPackages | null>
  >;
  selectedPolicyAppPackages: string[];
  setSelectedPolicyAppPackages: React.Dispatch<React.SetStateAction<string[]>>;
  filteredPolicyAppType: PolicyAppType;
  setFilteredPolicyAppType: React.Dispatch<React.SetStateAction<PolicyAppType>>;
  filteredPolicyAppTitle: string;
  setFilteredPolicyAppTitle: React.Dispatch<React.SetStateAction<string>>;
  filteredPolicyAppStatus: PolicyAppStatus;
  setFilteredPolicyAppStatus: React.Dispatch<
    React.SetStateAction<PolicyAppStatus>
  >;
}) {
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

  return (
    <div className="border flex flex-col rounded-lg">
      <AppLibraryTool
        filteredPolicyApps={filteredPolicyAppsTitle}
        selectedPolicyAppPackages={selectedPolicyAppPackages}
        setSelectedPolicyAppPackages={setSelectedPolicyAppPackages}
        filteredPolicyAppType={filteredPolicyAppType}
        setFilteredPolicyAppType={setFilteredPolicyAppType}
        filteredPolicyAppTitle={filteredPolicyAppTitle}
        setFilteredPolicyAppTitle={setFilteredPolicyAppTitle}
        filteredPolicyAppStatus={filteredPolicyAppStatus}
        setFilteredPolicyAppStatus={setFilteredPolicyAppStatus}
      />
      <div className="flex-1 mx-2 mb-2 min-w-0 relative">
        <div className="absolute size-full">
          <ScrollArea className=" rounded-lg border h-full">
            <div className="m-2 space-y-1">
              {filteredPolicyAppsTitle.map((filteredPolicyApp) => (
                <Draggable
                  key={filteredPolicyApp.appId}
                  policyApp={filteredPolicyApp}
                  selectedPolicyAppPackages={selectedPolicyAppPackages}
                  setSelectedPolicyAppPackages={setSelectedPolicyAppPackages}
                  className="relative hover:shadow-md mb-2"
                >
                  <AppLibraryTitle policyApp={filteredPolicyApp} />

                  <AppLibraryMenu
                    setRestrictedAppPackages={setRestrictedAppPackages}
                  />
                </Draggable>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
