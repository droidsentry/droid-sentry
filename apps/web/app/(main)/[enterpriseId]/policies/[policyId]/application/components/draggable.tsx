import { PolicyApp } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { GripVerticalIcon } from "lucide-react";
import { useState } from "react";
import { useAppRestriction } from "./restriction-provider";

export default function Draggable({
  children,
  className,
  policyApp,
}: {
  children: React.ReactNode;
  className?: string;
  policyApp: PolicyApp;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: policyApp.packageName,
    data: policyApp,
  });
  const { selectedAppPackages, setSelectedAppPackages, appRestrictionConfigs } =
    useAppRestriction();
  const [isDragging, setIsDragging] = useState(false);
  useDndMonitor({
    onDragStart(event) {
      setIsDragging(true);
    },
    onDragEnd(event) {
      setIsDragging(false);
    },
  });

  const style =
    transform && selectedAppPackages.length < 1
      ? {
          opacity: 0.5,
        }
      : undefined;
  const isSelectedPolicyApp = selectedAppPackages?.includes(
    policyApp.packageName
  );
  const isSelectedPolicyAppDragging =
    selectedAppPackages.length > 0 && !isSelectedPolicyApp;

  const handleSelect = () => {
    setSelectedAppPackages((prev) => {
      if (prev === null) {
        return [policyApp.packageName];
      }

      const isSelectedPolicyApp = prev.includes(policyApp.packageName);
      if (isSelectedPolicyApp) {
        return prev.filter(
          (packageName) => packageName !== policyApp.packageName
        );
      }
      return [...prev, policyApp.packageName];
    });
  };
  const appConfig = appRestrictionConfigs?.find(
    (config) => config.packageName === policyApp.packageName
  );

  return (
    <Card ref={setNodeRef} className={cn("relative", className)} style={style}>
      <CardContent className={cn("flex items-center space-x-2 p-4")}>
        <Button
          size="icon"
          variant="ghost"
          {...listeners}
          {...attributes}
          className="text-muted-foreground size-8 mr-2 z-10 hover:cursor-grab "
          disabled={isSelectedPolicyAppDragging}
        >
          <GripVerticalIcon className="size-4" />
        </Button>
        {children}
      </CardContent>
      <button
        onClick={handleSelect}
        className={cn(
          "absolute inset-0 rounded-md",
          isSelectedPolicyApp ? "ring-1 ring-muted-foreground" : "",
          isSelectedPolicyApp && isDragging ? "ring-1 ring-green-500" : ""
        )}
      />
      {appConfig?.installType === "BLOCKED" && (
        <span className="absolute inset-0 bg-muted/50" />
      )}
    </Card>
  );
}
