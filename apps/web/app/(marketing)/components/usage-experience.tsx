"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import PixelPhone from "../images/pixel-phone.png";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MousePointer, QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function UsageExperience({ className }: { className?: string }) {
  const [showVideo, setShowVideo] = useState(false);

  const handleShowVideo = () => {
    setShowVideo(true);
    setTimeout(() => {
      setShowVideo(false);
    }, 10000);
  };

  return (
    <div className={cn("relative w-full", className)}>
      {!showVideo && (
        <Button
          variant="outline"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          onClick={handleShowVideo}
        >
          使い方を見る
        </Button>
      )}
      {showVideo && (
        <div
          className={cn(
            "relative mt-2 aspect-video bg-background border rounded-md p-1 w-[350px]"
          )}
        >
          <MousePointer
            className={cn(
              "absolute top-3 right-1/2 size-5 opacity-0 ",
              showVideo && "animate-pointer-move"
            )}
          />
          <Card
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md p-2 z-10 opacity-0",
              showVideo && "animate-qrcode-show"
              // "absolute top-0 left-0 rounded-md p-2 z-10 opacity-0 scale-0 transition-all duration-300",
              // showVideo &&
              //   "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 scale-100 delay-300"
            )}
          >
            <QRCodeSVG
              value="https://droidsentry.net/"
              className="size-10"
              bgColor="transparent"
              fgColor=" hsl(var(--primary))"
            />
          </Card>
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0",
              showVideo && "animate-phone-show"
            )}
          >
            <Image src={PixelPhone} alt="PixelPhone" height={200} />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="text-primary size-5 p-3 transition-all duration-300 hover: hover:text-foreground"
          >
            <QrCodeIcon />
          </Button>
          <Table className="border rounded-md">
            <TableHeader>
              <TableRow className="">
                <TableHead className="text-xs h-5">端末名</TableHead>
                <TableHead className="text-xs h-5">ステータス</TableHead>
                <TableHead className="text-xs h-5">ポリシー名</TableHead>
                <TableHead className="text-xs h-5">同期時刻</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="">
                <TableCell className="text-center text-xs h-5 p-1">
                  田中
                </TableCell>
                <TableCell className="text-center text-xs h-5 p-1">◯</TableCell>
                <TableCell className="text-center text-xs h-5 p-1">
                  営業
                </TableCell>
                <TableCell className="text-center text-xs h-5 p-1">
                  2024/02/20
                </TableCell>
              </TableRow>
              <TableRow className="">
                <TableCell className="text-center text-xs h-5 p-1">
                  鈴木
                </TableCell>
                <TableCell className="text-center text-xs h-5 p-1">◯</TableCell>
                <TableCell className="text-center text-xs h-5 p-1">
                  営業
                </TableCell>
                <TableCell className="text-center text-xs h-5 p-1">
                  2024/02/20
                </TableCell>
              </TableRow>
              <TableRow className="">
                <TableCell className="text-center text-xs h-5 p-1">
                  高橋
                </TableCell>
                <TableCell className="text-center text-xs h-5 p-1">◯</TableCell>
                <TableCell className="text-center text-xs h-5 p-1">
                  営業
                </TableCell>
                <TableCell className="text-center text-xs h-5 p-1">
                  2024/02/19
                </TableCell>
              </TableRow>
              <TableRow className="">
                <TableCell className="text-center text-xs h-5 p-1">
                  佐藤
                </TableCell>
                <TableCell className="text-center text-xs h-5 p-1">◯</TableCell>
                <TableCell className="text-center text-xs h-5 p-1">
                  営業
                </TableCell>
                <TableCell className="text-center text-xs h-5 p-1">
                  2024/02/18
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
