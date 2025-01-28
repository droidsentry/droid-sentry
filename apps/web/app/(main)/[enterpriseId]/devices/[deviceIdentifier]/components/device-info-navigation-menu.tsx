"use client";

import { RouteParams } from "@/app/types/enterprise";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, Undo2Icon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { navigationItems } from "../data/navigation";

export default function DeviceInfoNavigationMenu({
  className,
}: {
  className?: string;
}) {
  const params = useParams<RouteParams>();
  const enterpriseId = params.enterpriseId;
  const deviceIdentifier = params.deviceIdentifier;

  return (
    <Table
      className={cn(
        "w-full",
        "bg-muted rounded-md dark:bg-muted/50",
        className
      )}
    >
      <TableHeader className="[&_tr]:border-b-0">
        <TableRow className="">
          <TableHead className="flex justify-center items-center h-16">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${enterpriseId}/devices`}>
                <Undo2Icon className="hover:text-primary transition-all duration-300" />
              </Link>
            </Button>
          </TableHead>
          <TableHead className="text-center font-mono font-bold tracking-wider">
            デバイス詳細
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {navigationItems.map((category) => (
          <TableRow key={category.title} className="relative group border-0">
            <TableCell className="flex justify-center">
              <category.icon
                size={20}
                className="group-hover:-translate-y-1 group-hover:-rotate-12 transition-all duration-300"
              />
            </TableCell>
            <TableCell className="font-mono font-bold text-muted-foreground group-hover:text-primary transition-all duration-300 border-t">
              {category.title}
            </TableCell>
            <TableCell className="flex justify-center">
              <Link
                href={`/${enterpriseId}/devices/${deviceIdentifier}/${category.url}`}
              >
                <ChevronRightIcon
                  size={20}
                  className="group-hover:translate-x-1 transition-all duration-300"
                />
                <span className="absolute inset-0"></span>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
