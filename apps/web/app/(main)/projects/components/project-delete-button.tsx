import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useProject } from "./project-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProjectDeleteButton({
  projectId,
}: {
  projectId: string;
}) {
  const { handleProjectDelete } = useProject();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 bottom-3 text-muted-foreground transition-all duration-300 hover:right-5 hover:text-foreground z-30 "
        >
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>プロジェクトを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            プロジェクトを削除すると、プロジェクトに関連するすべてのデータが削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleProjectDelete(projectId)}>
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
