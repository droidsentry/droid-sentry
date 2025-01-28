import { RouteParams } from "@/app/types/enterprise";
import CategoryTopBar from "./components/category-top-bar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<RouteParams>;
}) {
  const { enterpriseId, deviceIdentifier, category } = await params;
  return (
    <div className="flex flex-col h-full">
      <CategoryTopBar
        enterpriseId={enterpriseId}
        deviceIdentifier={deviceIdentifier}
        category={category}
        className="hidden lg:block"
      />
      <div className="flex-1 min-h-0 min-w-0">{children}</div>
    </div>
  );
}
