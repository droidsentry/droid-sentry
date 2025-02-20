"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

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

export default function UsageExperience() {
  const [showVideo, setShowVideo] = useState(false);
  const [pointerLift, setPointerLift] = useState(false);

  const handleStartAnimation = () => {
    setShowVideo(true);

    // ポインターの移動アニメーション
    setTimeout(() => {
      setPointerLift(true);
    }, 1580);

    // マウスアニメーション終了
    setTimeout(() => {
      setShowVideo(false);
      setPointerLift(false);
    }, 4000);
  };

  return (
    <div className="">
      <Button variant="outline" className="" onClick={handleStartAnimation}>
        使い方を見る
      </Button>
      {/* // デバイス一覧を表示、QRボタンを生成 */}
      <div
        className={cn(
          "relative mt-2 aspect-video bg-background border rounded-md p-1"
          // 'overflow-hidden'
        )}
      >
        <MousePointer
          className={cn(
            "absolute top-3 right-1/2 size-5 opacity-0 translate-x-[400px] translate-y-[400px] transition-all duration-1000 ",
            showVideo && "opacity-100 translate-x-0 translate-y-0",
            pointerLift && "-translate-x-[138px]"
          )}
        />
        <div className="">
          <Button
            variant="outline"
            size="icon"
            className="text-primary size-5 p-3 transition-all duration-300 hover: hover:text-foreground"
            // onClick={onClick}
          >
            <QrCodeIcon />
          </Button>
        </div>

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
    </div>
  );
}
