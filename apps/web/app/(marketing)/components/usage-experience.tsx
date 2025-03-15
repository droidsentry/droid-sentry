"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import PixelPhone from "../images/pixel-phone.png";

import { cn } from "@/lib/utils";
import { MousePointer, QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import DemoDeviceTable from "./usage-experience-animations/demo-device-table";
import { set } from "date-fns";

const animationKeys = [
  {
    seconds: 0,
    action: "mousemove",
  },
  {
    seconds: 30,
    action: "qr-move",
  },
  {
    seconds: 50,
    action: "frame-in",
  },
];

export default function UsageExperience({ className }: { className?: string }) {
  const [showVideo, setShowVideo] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const handleShowVideo = () => {
    setShowVideo(true);
    setTimeout(() => {
      // setShowVideo(false);
    }, 10000);
  };

  useEffect(() => {
    if (!showVideo) {
      setSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((v) => v + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showVideo]);

  return (
    <div className={cn("relative w-full", className)}>
      <span className="absolute top-4 right-4 text-red-500">{seconds}</span>
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
        <div className="w-full m-1 border border-red-300 rounded-md">
          <div
            className={cn(
              "relative mt-2 aspect-video bg-background border rounded-md p-1 w-[350px]"
            )}
          >
            <MousePointerAnimation seconds={seconds} />
            <QRCodeAnimation start={seconds >= 4} hidden={seconds >= 7} />
            <div
              className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0",
                showVideo && "animate-phone-show"
              )}
            >
              <Image src={PixelPhone} alt="PixelPhone" height={200} />
            </div>

            {/* <Button
            variant="outline"
            size="icon"
            className="text-primary size-5 p-3 transition-all duration-300 hover: hover:text-foreground"
          >
            <QrCodeIcon />
          </Button> */}
            <DemoDeviceTable />
          </div>
        </div>
      )}
    </div>
  );
}

function MousePointerAnimation({ seconds }: { seconds: number }) {
  const steps = [
    {
      seconds: 5,
      className: "opacity-100 bg-red-500",
    },
    {
      seconds: 40,
      className: "opacity-100 bg-greed-500",
    },
    {
      seconds: 60,
      className: "opacity-100 bg-black",
    },
  ];
  const activeStep = steps.findLast((value) => value.seconds <= seconds);

  return (
    <MousePointer
      className={cn(
        "absolute top-3 right-1/2 size-5 transition opacity-0",
        activeStep?.className
      )}
    />
  );
}

function QRCodeAnimation({
  start,
  hidden,
}: {
  start: boolean;
  hidden: boolean;
}) {
  return (
    <QRCodeSVG
      value="https://droidsentry.net/"
      className={cn(
        "size-10 transition-all absolute top-0 left-0 duration-1000",
        start && "top-10 left-10",
        hidden && "opacity-0"
      )}
      bgColor="transparent"
      fgColor=" hsl(var(--primary))"
    />
  );
}

function Frame({ start, hidden }: { start: boolean; hidden: boolean }) {
  return (
    <div
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0",
        start && "animate-phone-show"
      )}
    >
      <Image src={PixelPhone} alt="PixelPhone" height={200} />
    </div>
  );
}
