import { PolicyApp } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripVerticalIcon } from "lucide-react";
import Image from "next/image";

export default function DragAppsCard({
  className,
  policyApps,
  selectedPolicyAppPackages,
}: {
  className?: string;
  policyApps: PolicyApp[];
  selectedPolicyAppPackages: string[];
}) {
  // selectedPolicyAppPackagesの順番に基づいてpolicyAppsをソート
  const sortedDragAppsApps = selectedPolicyAppPackages
    .map((selectedPolicyAppPackage) =>
      policyApps.find((app) => app.packageName === selectedPolicyAppPackage)
    )
    .filter((app): app is PolicyApp => app !== undefined);

  const appsCount = selectedPolicyAppPackages.length;
  return (
    <Card
      className={cn(
        "relative hover:shadow-md mb-2 hover:cursor-grabbing",
        className
      )}
    >
      <CardContent className={cn("flex items-center space-x-2 p-4")}>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground size-8 mr-2 shrink-0 hover:cursor-grabbing"
        >
          <GripVerticalIcon className="size-4" />
        </Button>
        <div className="flex gap-2 flex-wrap">
          {sortedDragAppsApps.map((sortedDragAppsApp) => (
            <div className="relative" key={sortedDragAppsApp.appId}>
              <div className="relative border rounded-md size-10 overflow-hidden">
                <Image
                  src={sortedDragAppsApp.iconUrl}
                  alt={sortedDragAppsApp.title}
                  fill
                  sizes="40px"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-lg font-bold text-primary border h-10 min-w-10 flex items-center justify-center rounded-md shrink-0">
          +{appsCount}
        </div>
      </CardContent>
    </Card>
  );
}
