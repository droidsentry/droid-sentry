"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/public/images/logo.png";
import { SiAndroid } from "@icons-pack/react-simple-icons";
import { HomeIcon, ShieldCheckIcon, SmartphoneIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProjectLinkButton from "../../projects/components/project-link-button";
import UserMenu from "./user-menu";

export default function NavigationBar({
  className,
  enterpriseId,
}: {
  className?: string;
  enterpriseId: string;
}) {
  const pathname = usePathname();
  // pass名に指定の文字列がふくまれていればtrueを返す
  const isActive = (path: string) => {
    return pathname.includes(path);
  };

  return (
    <div className={cn("relative w-14 h-dvh", className)}>
      <nav
        aria-label="ナビゲーションバー"
        className="fixed group p-2 h-full z-40 w-14 hover:w-52 shadow-none hover:shadow-xl border-r border-default transition-width duration-200 overflow-hidden flex flex-col justify-between bg-sidebar"
      >
        <ul className="flex flex-col gap-2">
          <Button size="icon" variant="ghost" className="relative gap-2">
            <Link href="/" className="flex items-center font-bold gap-2 z-20">
              <Image
                src={logo}
                alt=""
                className="absolute left-1 size-8 dark:brightness-150 drop-shadow-lg"
                priority
              />
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "relative gap-2 justify-start"
              // isActive(`/${enterpriseId}`) && "bg-accent"
            )}
            disabled={true}
          >
            <HomeIcon
              size={20}
              className={cn(
                "absolute left-3 "
                // isActive(`/${enterpriseId}`) && "text-accent"
              )}
            />
            <span
              className={cn(
                "opacity-0 group-hover:opacity-100 absolute left-12 "
                // isActive(`/${enterpriseId}`) && "text-primary"
              )}
            >
              ホーム
            </span>
          </Button>

          <ProjectLinkButton mode="hover" />

          <Button
            variant="ghost"
            className={cn(
              "relative gap-2 justify-start group/device",
              isActive(`/${enterpriseId}/devices`) && "bg-accent"
            )}
            asChild
          >
            <Link href={`/${enterpriseId}/devices`}>
              <SmartphoneIcon
                size={20}
                className={cn(
                  "absolute left-3 ",
                  isActive(`/${enterpriseId}/devices`) && "text-primary",
                  "group-hover/device:text-primary"
                )}
              />
              <span
                className={cn(
                  "opacity-0 group-hover:opacity-100 absolute left-12 ",
                  isActive(`/${enterpriseId}/devices`) && "text-primary",
                  "group-hover/device:text-primary",
                  "transition-all duration-200"
                )}
              >
                デバイス
              </span>
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "relative gap-2 justify-start group/policy",
              isActive(`/${enterpriseId}/policies`) && "bg-accent",
              "transition-all duration-200"
            )}
            asChild
          >
            <Link href={`/${enterpriseId}/policies`}>
              <ShieldCheckIcon
                size={20}
                className={cn(
                  "absolute left-3 ",
                  isActive(`/${enterpriseId}/policies`) && "text-primary",
                  "group-hover/policy:text-primary",
                  "transition-all duration-200"
                )}
              />
              <span
                className={cn(
                  "opacity-0 group-hover:opacity-100 absolute left-12 ",
                  isActive(`/${enterpriseId}/policies`) && "text-primary",
                  "group-hover/policy:text-primary",
                  "transition-all duration-200"
                )}
              >
                ポリシー
              </span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "relative gap-2 justify-start group/app",
              isActive(`/${enterpriseId}/apps`) && "bg-accent",
              "transition-all duration-200"
            )}
            asChild
          >
            <Link href={`/${enterpriseId}/apps`}>
              <SiAndroid
                size={20}
                className={cn(
                  "absolute left-3 ",
                  isActive(`/${enterpriseId}/apps`) && "text-primary",
                  "group-hover/app:text-primary",
                  "transition-all duration-200"
                )}
              />
              <span
                className={cn(
                  "opacity-0 group-hover:opacity-100 absolute left-12",
                  isActive(`/${enterpriseId}/apps`) && "text-primary",
                  // "group-hover/app:text-primary",
                  "transition-all duration-200"
                )}
              >
                アプリ管理
              </span>
            </Link>
          </Button>
        </ul>

        <ul className="flex flex-col gap-2 pb-1">
          <UserMenu mode="hover" />
        </ul>
      </nav>
    </div>
  );
}
