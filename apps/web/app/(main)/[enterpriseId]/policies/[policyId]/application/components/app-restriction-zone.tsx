import { PolicyApp } from "@/lib/types/policy";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { RestrictedAppKey, useAppRestriction } from "./restriction-provider";

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
    <div className="relative size-full">
      <div className="absolute size-full">
        <ScrollArea className="rounded-lg h-full">
          {sortedPolicyApps.length === 0 ? (
            <span className="text-muted-foreground font-mono text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
              アプリケーションをドロップしてください
            </span>
          ) : (
            <div className="flex gap-2 flex-wrap pt-3">
              {sortedPolicyApps.map((policyApp) => (
                <div className="relative group" key={policyApp.appId}>
                  <div className="relative size-10 border rounded-md overflow-hidden">
                    <Image
                      key={policyApp.appId}
                      src={policyApp.iconUrl}
                      alt={policyApp.title}
                      fill
                      sizes="56px"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute -top-4 -right-4 size-6 opacity-0 group-hover:opacity-100 rounded-full m-1 z-50"
                    onClick={() => handleRemoveApp(policyApp.packageName)}
                  >
                    <CircleX className="text-muted-foreground " />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
