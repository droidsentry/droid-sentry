"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Apps } from "@/app/types/policy";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AppDropZoneProps {
  apps: Apps[];
  title: string;
  filterCondition: (app: Apps) => boolean;
  className?: string;
}

export default function AppDropZone({
  apps,
  title,
  filterCondition,
  className,
}: AppDropZoneProps) {
  const [isClient, setIsClient] = useState(false);

  const filteredApps = useMemo(
    () => apps.filter(filterCondition),
    [apps, filterCondition]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <Card className={cn("", className)}>
      <ScrollArea className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApps.length === 0 ? (
            <p className="text-muted-foreground font-mono text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              アプリケーションをドロップしてください
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredApps.map((app) => (
                <div key={app.appId} className="relative group">
                  <div className="relative border rounded-md size-12 overflow-hidden ">
                    <Image
                      src={app.iconUrl}
                      alt={app.title}
                      fill
                      sizes="60px"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute -top-4 -right-4 size-6 opacity-0 group-hover:opacity-100 rounded-full m-1"
                  >
                    <CircleX className="text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
