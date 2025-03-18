import {
  BadgeCheck,
  CircleUserRoundIcon,
  CreditCard,
  LifeBuoy,
  Mail,
  MessageSquare,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import SignOutButton from "../projects/components/sign-out-button";
import { signOut } from "@/lib/actions/auth/supabase";

export default function UserMenu({ mode }: { mode?: "hover" }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative gap-2 transition-all duration-200 justify-start",
            mode === "hover" && "group-hover:w-full"
          )}
        >
          <CircleUserRoundIcon size={20} className="absolute left-3" />
          <span
            className={cn(
              "absolute left-12",
              mode === "hover" && "opacity-0 transition group-hover:opacity-100"
            )}
          >
            ユーザー
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="flex items-center justify-between">
          <DropdownMenuLabel>アカウント情報</DropdownMenuLabel>
          <ModeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <User size={20} className="mr-2" />
            <span>プロフィール</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <CreditCard size={20} className="mr-2" />
            <span>請求管理</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/setting/billing">
              <BadgeCheck size={20} className="mr-2" />
              <span>支払い</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings size={20} className="mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <Users size={20} className="mr-2" />
            <span>組織</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled>
              <UserPlus size={20} className="mr-2 text-muted-foreground/70" />
              <span className="text-muted-foreground/70">ユーザーを招待</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem disabled>
                  <Mail size={20} className="mr-2" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <MessageSquare size={20} className="mr-2" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <PlusCircle size={20} className="mr-2" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <LifeBuoy size={20} className="mr-2" />
          <span>サポート</span>
        </DropdownMenuItem>
        <form action={signOut}>
          <SignOutButton />
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
