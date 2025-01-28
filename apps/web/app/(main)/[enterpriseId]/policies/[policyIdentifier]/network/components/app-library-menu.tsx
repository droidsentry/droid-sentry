import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { List, RefreshCw } from "lucide-react";
import { RestrictedAppPackages } from "./app-restriction";

export default function AppLibraryMenu({
  setRestrictedAppPackages,
}: {
  setRestrictedAppPackages: React.Dispatch<
    React.SetStateAction<RestrictedAppPackages | null>
  >;
}) {
  // const handleRemoveApp = (packageName: string) => {
  //   setRestrictedAppPackages((prev) => {
  //     if (!prev) return prev;
  //     const newRestrictedAppPackages = {
  //       ...prev,
  //       [id]: prev[id].filter((app) => app !== packageName),
  //     };
  //     return newRestrictedAppPackages;
  //   });
  // };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="z-10">
          <List className="size-4 mx-2" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className=" space-y-1 px-2" align="end">
          <DropdownMenuItem
            onClick={() => {
              console.log("reset app policy");
            }}
          >
            <RefreshCw className="mr-4 size-4" />
            <span>設定をリセット</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
