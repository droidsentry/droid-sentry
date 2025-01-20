import { ProjectsSidebar } from "../projects/components/projects-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row h-dvh">
      <ProjectsSidebar className="hidden xl:block border-r " />
      <div className="w-full flex flex-col">
        <div className="h-12 w-full border-b"></div>
        <ScrollArea className="flex-1">{children}</ScrollArea>
      </div>
    </div>
  );
}
