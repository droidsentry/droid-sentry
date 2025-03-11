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
import { toast } from "sonner";

export default function CreateQrButton() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const enterpriseId = params.enterpriseId as string;

  const onClick = async () => {
    setQrCode(null);
    await createEnrollmentToken(enterpriseId)
      .then((qrData) => {
        setQrCode(qrData);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsOpen(false);
      });
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
        <DialogContent className="aspect-square ">
          <DialogHeader className="relative">
            <DialogTitle>QRコード</DialogTitle>
            <DialogDescription className="m-auto p-3 "></DialogDescription>
            {qrCode ? (
              <QRCodeSVG
                className="max-h-full max-w-full size-full"
                bgColor="transparent"
                fgColor=" hsl(var(--primary))"
                value={qrCode}
                size={300}
              />
            ) : (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Loader2Icon className="size-20 animate-spin " />
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
