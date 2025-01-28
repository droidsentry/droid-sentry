import { Apps } from "@/app/types/policy";
import { useDraggable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

export default function Draggable({
  children,
  app,
}: {
  children: React.ReactNode;
  app: Apps;
}) {
  const [isClient, setIsClient] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: app.appId,
    data: app,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: 0.5, // ドラッグ中は半透明に
      }
    : undefined;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      // style={style}
    >
      {children}
    </div>
  );
}
