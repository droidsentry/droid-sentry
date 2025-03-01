"use client";

import { createEnrollmentToken } from "@/actions/emm/create-enrollment-token";
import { Button } from "@/components/ui/button";
import { Loader2Icon, QrCodeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function CreateQrButton() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const params = useParams();
  const enterpriseId = params.enterpriseId as string;

  const onClick = async () => {
    setQrCode(null);
    const qrData = await createEnrollmentToken(enterpriseId);
    console.log("qrData", qrData);
    if (qrData) {
      setQrCode(qrData);
      // setQrCode(`http://192.168.10.117:3000/api/emm/qr?parent=${parent}`);
      // setQrCode(`https://enterprise.google.com/android/enroll?et=${qrData}`);
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="text-primary size-8 transition-all duration-300 hover: hover:text-foreground z-30"
            onClick={onClick}
          >
            <QrCodeIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QRコード</DialogTitle>
            <DialogDescription className="m-auto p-3">
              {qrCode ? (
                <QRCodeSVG
                  className="max-h-full max-w-full size-full"
                  bgColor="transparent"
                  fgColor=" hsl(var(--primary))"
                  value={qrCode}
                  size={300}
                />
              ) : (
                <Loader2Icon className="size-20 animate-spin" />
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
