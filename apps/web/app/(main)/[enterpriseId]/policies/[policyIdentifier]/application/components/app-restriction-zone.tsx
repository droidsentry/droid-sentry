import { PolicyApp } from "@/app/types/policy";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import {
  RestrictedAppKey,
  useAppRestriction,
} from "./app-restriction-provider";

export default function AppRestrictionZone({
  policyApps,
  id,
}: {
  policyApps: PolicyApp[];
  id: RestrictedAppKey;
}) {
  const {
    restrictedAppPackages,
    setRestrictedAppPackages,
    setAppRestrictionConfigs,
  } = useAppRestriction();
  // restrictedAppIdsの順番に基づいてpolicyAppsをソート
  const sortedPolicyApps = restrictedAppPackages?.[id]
    ? restrictedAppPackages[id]
        .map((restrictedAppPackage) =>
          policyApps.find((app) => app.packageName === restrictedAppPackage)
        )
        .filter((app): app is PolicyApp => app !== undefined)
    : [];
  const handleRemoveApp = (packageName: string) => {
    // ドラック&ドロップの場所を更新
    setRestrictedAppPackages((prev) => {
      if (!prev) return prev;
      const newRestrictedAppPackages = {
        ...prev,
        [id]: prev[id].filter((app) => app !== packageName),
      };
      return newRestrictedAppPackages;
    });
    // ポリシーに設定するアプリ制限の設定を更新
    setAppRestrictionConfigs((prev) => {
      if (!prev) return prev;
      let newAppRestrictionConfigs = [...prev];
      newAppRestrictionConfigs = newAppRestrictionConfigs.filter(
        (config) => config.packageName !== packageName
      );
      return newAppRestrictionConfigs;
    });
  };
  return (
    <div className="absolute size-full mx-2 my-3">
      <ScrollArea className=" rounded-lg h-full">
        <div className="m-4">
          <div className="flex flex-wrap gap-2">
            {sortedPolicyApps.map((policyApp) => (
              <div key={policyApp.appId} className="relative group">
                <div className="relative border rounded-md size-14 overflow-hidden " />
                <Image
                  key={policyApp.appId}
                  src={policyApp.iconUrl}
                  alt={policyApp.title}
                  fill
                  sizes="60px"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute -top-4 -right-4 size-6 opacity-0 group-hover:opacity-100 rounded-full m-1 z-10"
                  onClick={() => handleRemoveApp(policyApp.packageName)}
                >
                  <CircleX className="text-muted-foreground " />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
