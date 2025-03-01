import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({
  children,
  id,
  className,
  title,
}: {
  children: React.ReactNode;
  id: "availableApps" | "restrictedApps" | "disabledApps";
  className?: string;
  title?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "rounded-md",
        isOver && "ring-1 ring-sky-400 transition-all duration-400",
        className
      )}
    >
      {children}
    </Card>
  );
}
