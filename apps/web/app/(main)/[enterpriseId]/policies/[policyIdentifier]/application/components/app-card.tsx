"use client";

import { Apps } from "@/app/types/policy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DragOverlay, useDraggable } from "@dnd-kit/core";
import { SiGoogleplay } from "@icons-pack/react-simple-icons";
import {
  GlobeLockIcon,
  GripVertical,
  List,
  LockIcon,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AppCard({
  app,
  isDragging,
}: {
  app: Apps;
  isDragging?: boolean;
}) {
  const [isClient, setIsClient] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: app.appId,
    data: app,
  });
  const style =
    transform && !isDragging
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          // transition: "transform 0.3s ease",
          opacity: isDragging ? 1 : 0, // ドラッグ中は半透明に
        }
      : undefined;

  const handleResetAppPolicy = () => {
    console.log("reset app policy");
    console.log("app", app);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("relative hover:shadow-md mb-2")}
    >
      <CardContent
        className={cn(
          "flex items-center space-x-2 p-4"
          // app.installType === "BLOCKED" ? "bg-muted/50" : "",
        )}
      >
        {" "}
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground size-10 cursor-grab w-fit p-2 z-10"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="size-4" />
          <span className="sr-only">ドラッグハンドル</span>
        </Button>
        <div className="relative">
          <div className="relative border rounded-md size-10 overflow-hidden">
            <Image src={app.iconUrl} alt={app.title} fill sizes="40px" />
          </div>
          {app.appType === "PUBLIC" ? (
            <SiGoogleplay className="size-4 text-muted-foreground absolute -top-3 -right-3" />
          ) : app.appType === "PRIVATE" ? (
            <LockIcon className="size-4 text-muted-foreground absolute -top-3 -right-3" />
          ) : (
            <GlobeLockIcon className="size-4 text-muted-foreground absolute -top-3 -right-3" />
          )}
        </div>
        <CardTitle className="truncate text-lg pl-2 w-full" title={app.title}>
          {app.title}
        </CardTitle>
        <Separator orientation="vertical" className="h-10 mx-1" />
        {(app.installType || app.disabled) && (
          <div className="w-[200px]">
            <Badge
              variant={
                app.installType === "BLOCKED" ? "destructive" : "secondary"
              }
              className=""
            >
              {app.installType === "BLOCKED"
                ? "インストール不可"
                : app.installType === "FORCE_INSTALLED"
                  ? "自動インストール"
                  : app.disabled
                    ? "アプリ無効"
                    : ""}
            </Badge>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="z-10">
              <List className="size-4 mx-2" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className=" space-y-1 px-2" align="end">
              <DropdownMenuItem onSelect={handleResetAppPolicy}>
                <RefreshCw className="mr-4 size-4" />
                <span>設定をリセット</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </CardContent>
      {app.installType === "BLOCKED" && (
        <span className="absolute inset-0 bg-muted/50" />
      )}
    </Card>
  );
}
