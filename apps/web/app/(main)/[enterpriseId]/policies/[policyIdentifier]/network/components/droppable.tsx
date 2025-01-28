import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

export default function Droppable({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id: "availableApps" | "restrictedApps" | "disabledApps";
  className?: string;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-md",
        isOver && "ring-1 ring-sky-400 transition-all duration-400",
        className
      )}
    >
      {children}
    </div>
  );
}
