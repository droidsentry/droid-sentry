"use client";

import { createDeviceEnrollmentTokenWithQRCode } from "@/lib/actions/emm/device";
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
import { SERVICE_LIMIT_CONFIG } from "@/lib/data/service";

export default function CreateQrButton({
  isMaxDevicesKittingPerUser,
}: {
  isMaxDevicesKittingPerUser: boolean;
}) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const enterpriseId = params.enterpriseId as string;

  const onClick = async () => {
    if (!isMaxDevicesKittingPerUser) {
      const config = SERVICE_LIMIT_CONFIG["max_devices_kitting_per_user"];
      toast.error(config.errorMessage);
      return;
    }
    setQrCode(null);
    await createDeviceEnrollmentTokenWithQRCode(enterpriseId)
      .then((qrData) => {
        setQrCode(qrData);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        // setIsOpen(false);
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
