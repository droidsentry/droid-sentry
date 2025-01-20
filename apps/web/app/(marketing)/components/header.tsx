import HeaderLogoButton from "@/components/header-logo-button";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";
import { cn } from "../../../lib/utils";
import SingInButton from "./sign-in-button";

export default async function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn("px-2 py-2 sm:py-4 flex items-center gap-1", className)}
    >
      <HeaderLogoButton />
      <nav className="flex ml-auto">
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/features" replace>
            <span className="hidden sm:block">特徴</span>
            <Info size={20} />
          </Link>
        </Button>
        {/* <Button variant="ghost" className="gap-2" asChild>
          <Link href="/docs/books" replace>
            <span className="hidden sm:block">ドキュメント</span>
            <Book size={20} />
          </Link>
        </Button> */}
        <SingInButton />
      </nav>
    </header>
  );
}
