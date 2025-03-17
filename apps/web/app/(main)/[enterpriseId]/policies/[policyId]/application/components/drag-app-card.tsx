import { PolicyApp } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripVerticalIcon } from "lucide-react";
import AppLibraryTitle from "./library-title";

export default function DragAppCard({
  className,
  policyApp,
}: {
  className?: string;
  policyApp: PolicyApp;
}) {
  return (
    <Card className={cn("relative hover:shadow-md mb-2", className)}>
      <CardContent className={cn("flex items-center space-x-2 p-4")}>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground size-8 mr-2 hover:cursor-grabbing"
        >
          <GripVerticalIcon className="size-4" />
        </Button>
        <AppLibraryTitle policyApp={policyApp} />
      </CardContent>
    </Card>
  );
}
