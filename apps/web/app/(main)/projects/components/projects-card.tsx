"use client";

import { getSignUpUrl } from "@/actions/emm/signup-url";
import { Button } from "@/components/ui/button";
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
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { ProjectWithEnterpriseRelation } from "../../../types/project";
import { deleteProject } from "../actions/projects";
import ProductOptionsButton from "./product-options-button";

import { SiAndroid } from "@icons-pack/react-simple-icons";
import { getBaseURL } from "@/lib/base-url/client";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  projectsData: ProjectWithEnterpriseRelation[];
  className?: string;
}

export default function ProjectsCard({
  projectsData,
  className,
}: ProjectCardProps) {
  const [projects, setProjects] =
    useState<ProjectWithEnterpriseRelation[]>(projectsData);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
  const url = getBaseURL(currentUrl);

  const handleGetSignUpUrl = (projectId: string, projectName: string) => {
    setPendingProjectId(projectId);
    startTransition(async () => {
      await getSignUpUrl(projectId, url, projectName);
      setPendingProjectId(null);
    });
  };

  const handleProjectDelete = async (projectId: string) => {
    setPendingProjectId(projectId);
    startTransition(async () => {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.project_id !== projectId));
      setPendingProjectId(null);
    });
  };
  useEffect(() => {
    const currentUrl = window.location.origin;
    setCurrentUrl(currentUrl);
  }, [setCurrentUrl]);

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
            <Card className=" relative h-60 duration-300 dark:bg-zinc-900 dark:border-zinc-700 transition ease-in-out group-hover/card:bg-accent">
              <CardHeader>
                <CardTitle className="text-lg flex">
                  プロジェクト : {project.project_name}
                </CardTitle>
                <CardDescription>{enterpriseId ?? "未設定"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>端末数：</p>
                <p>管理者：</p>
                <p>メンバー：</p>
              </CardContent>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 bottom-3 text-muted-foreground transition-all duration-300 hover:right-5 hover:text-foreground z-30 "
                onClick={() => handleProjectDelete(project.project_id)}
              >
                <Trash2Icon />
              </Button>
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
                <button
                  onClick={() =>
                    handleGetSignUpUrl(project.project_id, project.project_name)
                  }
                  className="group/button absolute inset-0 z-20 w-full h-full transition-colors duration-300"
                >
                  <span className="sr-only">
                    サインアップURLを発行し、リダイレクトする
                  </span>
                </button>
              )}
              {isPending && pendingProjectId === project.project_id && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <Loader2 className="animate-spin text-muted-foreground size-12" />
                </div>
              )}
            </Card>
          </div>
        );
      })}
      <Card className="flex h-60 items-center justify-center hover:bg-accent hover:border-accent-foreground duration-300 relative">
        <Link href="/projects/new">
          <span className="absolute inset-0" />
          <span className="sr-only">プロジェクト画面に遷移する</span>
          <Plus className="text-muted-foreground size-10 " />
        </Link>
      </Card>
    </div>
  );
}

const projectOptions = [
  { icon: <SmartphoneIcon />, link: "devices", name: "デバイス" },
  { icon: <ShieldCheckIcon />, link: "policies", name: "ポリシー" },
  { icon: <SiAndroid />, link: "apps", name: "アプリ" },
];
