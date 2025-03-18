"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { deviceInfoNavigationItems } from "../data/navigation";

export default function DeviceDetailInfoTopBar({
  enterpriseId,
  deviceId,
  className,
}: {
  enterpriseId: string;
  deviceId: string;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground m-1 mx-1.5 w-fit",
        className
      )}
    >
      {deviceInfoNavigationItems.map((item) => {
        const href = `/${enterpriseId}/devices/${deviceId}/${item.url}`;
        const isActive = pathname === href;

        return (
          <Link
            key={item.url}
            href={href}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
              isActive && "text-foreground shadow-sm bg-card"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
