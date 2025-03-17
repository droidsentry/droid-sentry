"use client";

import HeaderLogoButton from "@/components/header-logo-button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import UserMenu from "../../components/user-menu";
import ProjectLinkButton from "./project-link-button";

export function ProjectsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const projectPath = `/projects`;
  const isActive = pathname === projectPath;
  const title = projectSideBarLinks.find(
    (projectSideBarLink) => projectSideBarLink.url === pathname
  )?.title;

  return (
    <div
      className={cn("w-64 h-dvh border-r flex flex-col bg-sidebar", className)}
    >
      <nav className="flex flex-col justify-between h-full px-2">
        <ul className="flex flex-col space-y-2">
          <li className="h-12 py-1 border-b">
            <HeaderLogoButton title={title} className="w-full py-1 font-mono" />
          </li>
          <ProjectLinkButton isActive={isActive} />
        </ul>
        <ul className="flex flex-col gap-2 pb-1">
          <UserMenu />
        </ul>
      </nav>
    </div>
  );
}

const projectSideBarLinks = [
  {
    title: "プロジェクト",
    url: "/projects",
  },
  {
    title: "プラン",
    url: "/setting/billing",
  },
];
