"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "next/navigation";
import { SheetAppInfo } from "@/app/types/apps";
import Image from "next/image";
import { ExternalLinkIcon, FileIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AppSheet({
  isOpen,
  setIsOpen,
  appInfo,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  appInfo?: SheetAppInfo;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const appDetails = appInfo?.appData;

  const handleDownloadJson = () => {
    try {
      if (!appDetails?.name) {
        toast.error("アプリケーション情報が取得できていません");
        return;
      }
      window.location.href = `/api/download?appId=${appInfo?.appId}`;
      setIsOpen(false);
    } catch (error) {
      toast.error("アプリケーション情報の取得に失敗しました");
      console.error(error);
    }
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (!isOpen) {
          router.push(pathname);
        }
      }}
    >
      <SheetContent
        side="left"
        className="w-[90vw] sm:w-[600px] sm:max-w-full p-0"
      >
        <ScrollArea className="h-full p-6">
          <SheetHeader>
            <SheetTitle>アプリケーション情報</SheetTitle>
            <SheetDescription>
              <span className="sr-only">アプリケーションの詳細情報を表示</span>
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-6">
            <div className="flex items-center space-x-4">
              <Image
                src={appDetails?.iconUrl || ""}
                alt={appDetails?.name || ""}
                width={64}
                height={64}
                className="rounded-lg border"
              />
              <div>
                <h2 className="text-xl font-bold">{appDetails?.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {appDetails?.author}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">バージョン</h3>
              <p>{appDetails?.appVersions?.[0]?.versionString}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">minSdkVersion</h3>
              <p>{appDetails?.minAndroidSdkVersion}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">支払い</h3>
              <p>{appDetails?.appPricing}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">最終更新日</h3>
              <p>{appDetails?.updateTime}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">説明</h3>
              <ScrollArea className="h-[300px]">
                <p className="text-sm">{appDetails?.fullDescription}</p>
              </ScrollArea>
            </div>
            <div className="flex justify-between p-1">
              <Button
                variant="outline"
                onClick={handleDownloadJson}
                disabled={!appDetails?.name}
              >
                <FileIcon className="w-4 h-4 mr-2" />
                JSONで出力する
              </Button>
              {appDetails?.distributionChannel === "PUBLIC_GOOGLE_HOSTED" && (
                <Button
                  variant="outline"
                  disabled={!appDetails?.playStoreUrl}
                  asChild
                >
                  <Link href={appDetails?.playStoreUrl || ""} target="_blank">
                    <ExternalLinkIcon className="w-4 h-4 mr-2" />
                    Play Store を開く
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
