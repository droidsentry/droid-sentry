import { PolicyApp } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDndMonitor, useDraggable } from "@dnd-kit/core";
import { GripVerticalIcon } from "lucide-react";
import { useState } from "react";

export default function Draggable({
  children,
  className,
  policyApp,
  selectedPolicyAppPackages,
  setSelectedPolicyAppPackages,
}: {
  children: React.ReactNode;
  className?: string;
  policyApp: PolicyApp;
  selectedPolicyAppPackages: string[];
  setSelectedPolicyAppPackages: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: policyApp.packageName,
    data: policyApp,
  });
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
    transform && selectedPolicyAppPackages.length < 1
      ? {
          opacity: 0.5,
        }
      : undefined;

  const isSelectedPolicyApp = selectedPolicyAppPackages?.includes(
    policyApp.packageName
  );
  const isSelectedPolicyAppAndDragging =
    selectedPolicyAppPackages.length > 0 && !isSelectedPolicyApp;

  return (
    <Card ref={setNodeRef} className={cn("relative", className)} style={style}>
      <CardContent className={cn("flex items-center space-x-2 p-4")}>
        <Button
          size="icon"
          variant="ghost"
          {...listeners}
          {...attributes}
          className="text-muted-foreground size-8 mr-2 z-10 hover:cursor-grab "
          disabled={isSelectedPolicyAppAndDragging}
        >
          <GripVerticalIcon className="size-4" />
        </Button>
        {children}
      </CardContent>
      <button
        onClick={() => {
          setSelectedPolicyAppPackages((prev) => {
            if (prev === null) {
              return [policyApp.packageName];
            }
            const isSelectedPolicyApp = prev?.includes(policyApp.packageName);
            if (isSelectedPolicyApp) {
              return prev?.filter(
                (packageName) => packageName !== policyApp.packageName
              );
            }
            return [...prev, policyApp.packageName];
          });
        }}
        className={cn(
          "absolute inset-0 rounded-md",
          isSelectedPolicyApp ? "ring-1 ring-muted-foreground" : "",
          isSelectedPolicyApp && isDragging ? "ring-1 ring-green-500" : ""
        )}
      />
    </Card>
  );
}
