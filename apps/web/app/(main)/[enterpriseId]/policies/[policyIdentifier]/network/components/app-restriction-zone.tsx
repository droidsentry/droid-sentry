import { PolicyApp } from "@/app/types/policy";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  AppDetailSettings,
  RestrictedAppKey,
  RestrictedAppPackages,
} from "./app-restriction";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

export default function AppRestrictionZone({
  policyApps,
  id,
  restrictedAppPackages,
  setRestrictedAppPackages,
  setAppDetailSettings,
}: {
  policyApps: PolicyApp[];
  id: RestrictedAppKey;
  restrictedAppPackages: RestrictedAppPackages | null;
  setRestrictedAppPackages: React.Dispatch<
    React.SetStateAction<RestrictedAppPackages | null>
  >;
  setAppDetailSettings: React.Dispatch<React.SetStateAction<AppDetailSettings>>;
}) {
  // if (!restrictedAppPackages) return null;
  // restrictedAppIdsの順番に基づいてpolicyAppsをソート
  const sortedPolicyApps = restrictedAppPackages?.[id]
    ? restrictedAppPackages[id]
        .map((restrictedAppPackage) =>
          policyApps.find((app) => app.packageName === restrictedAppPackage)
        )
        .filter((app): app is PolicyApp => app !== undefined)
    : [];

  const handleRemoveApp = (packageName: string) => {
    setRestrictedAppPackages((prev) => {
      if (!prev) return prev;
      const newRestrictedAppPackages = {
        ...prev,
        [id]: prev[id].filter((app) => app !== packageName),
      };
      return newRestrictedAppPackages;
    });
    setAppDetailSettings((prev) => {
      const newAppDetailSettings = { ...prev };
      delete newAppDetailSettings[packageName];
      return newAppDetailSettings;
    });
  };

  return (
    <div className="absolute size-full">
      <ScrollArea className=" rounded-lg border h-full">
        <div className="m-2">
          <div className="flex flex-wrap gap-2">
            {sortedPolicyApps.map((policyApp) => (
              <div key={policyApp.appId} className="relative group">
                <div className="relative border rounded-md size-12 overflow-hidden " />
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
