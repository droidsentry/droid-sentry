"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  Loader2,
  Plus,
  ShieldCheckIcon,
  SmartphoneIcon,
} from "lucide-react";
import Link from "next/link";

import ProductOptionsButton from "./product-options-button";

import { cn } from "@/lib/utils";
import { SiAndroid } from "@icons-pack/react-simple-icons";
import ProjectDeleteButton from "./project-delete-button";
import { useProject } from "./project-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";

export default function ProjectsCardList({
  className,
  isProjectLimit,
}: {
  className?: string;
  isProjectLimit: boolean;
}) {
  const router = useRouter();
  const [isCreateProjectPending, startCreateProjectTransition] =
    useTransition();
  const { projects, isPending, pendingProjectId } = useProject();

  const handleCreateProject = async () => {
    startCreateProjectTransition(async () => {
      router.push("/projects/new");
    });
  };
  console.log("isProjectLimit", isProjectLimit);

  return (
    <div
      className={cn(
        "mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full",
        className
      )}
    >
      {projects.map((project) => {
        const enterpriseId = project.enterprise_id;
        return (
          <div className="group/card" key={project.project_id}>
            <Card className="relative h-60 duration-300 dark:bg-zinc-900 dark:border-zinc-700 transition ease-in-out group-hover/card:bg-accent">
              <CardHeader className="pr-16">
                <CardTitle className="text-lg overflow-hidden text-ellipsis whitespace-nowrap">
                  プロジェクト : {project.project_name}
                </CardTitle>
                <CardDescription>
                  エンタープライズID : {enterpriseId ?? "未設定"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>端末数：</p>
                <p>管理者：</p>
                <p>メンバー：</p>
              </CardContent>
              <ProjectDeleteButton projectId={project.project_id} />
              <ChevronRight className="absolute right-6 top-7 text-muted-foreground transition-all duration-200 group-hover/card:right-5 group-hover/card:text-foreground" />
              {enterpriseId && (
                <div className="absolute left-5 bottom-3 flex flex-row space-x-2">
                  {projectOptions.map((option) => (
                    <ProductOptionsButton
                      key={option.name}
                      className="z-30"
                      icon={option.icon}
                      link={`${enterpriseId}/${option.link}`}
                      name={option.name}
                    />
                  ))}
                </div>
              )}
              {!enterpriseId && (
                <Link
                  href={`/projects/sign-up?name=${project.project_name}&Id=${project.project_id}`}
                  className="group/button absolute inset-0 z-20 w-full h-full transition-colors duration-300"
                >
                  <span className="sr-only">サインアップページに遷移する</span>
                </Link>
              )}
              {isPending && pendingProjectId === project.project_id && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-muted/50">
                  <Loader2 className="animate-spin text-muted-foreground size-12" />
                </div>
              )}
            </Card>
          </div>
        );
      })}
      {isProjectLimit && (
        <Card
          className={cn(
            "flex h-60 items-center justify-center  relative",
            !isCreateProjectPending &&
              "hover:bg-accent hover:border-accent-foreground duration-300"
          )}
        >
          <button
            onClick={handleCreateProject}
            disabled={isCreateProjectPending}
          >
            <span className="absolute inset-0" />
            <span className="sr-only">プロジェクト画面に遷移する</span>

            {!isCreateProjectPending && (
              <Plus className="text-muted-foreground size-10 " />
            )}
          </button>
          {isCreateProjectPending && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <Loader2 className="animate-spin text-muted-foreground size-12" />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

const projectOptions = [
  { icon: <SmartphoneIcon />, link: "devices", name: "デバイス" },
  { icon: <ShieldCheckIcon />, link: "policies", name: "ポリシー" },
  { icon: <SiAndroid />, link: "apps", name: "アプリ" },
];
