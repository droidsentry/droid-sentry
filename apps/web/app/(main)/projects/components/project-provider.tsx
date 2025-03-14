"use client";

import { getSignUpUrl } from "@/actions/emm/enterprise";
import { ProjectWithEnterpriseRelation } from "@/app/types/project";
import { getBaseURL } from "@/lib/base-url/client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { deleteProject } from "../actions/projects";

type ContextType = {
  projects: ProjectWithEnterpriseRelation[];
  handleProjectDelete: (projectId: string) => void;
  handleGetSignUpUrl: (projectId: string, projectName: string) => void;
  isPending: boolean;
  pendingProjectId: string | null;
};

const Context = createContext<ContextType>({} as ContextType);

export function ProjectProvider({
  children,
  projectsData,
}: {
  children: ReactNode;
  projectsData: ProjectWithEnterpriseRelation[];
}) {
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
    <Context.Provider
      value={{
        projects,
        handleProjectDelete,
        handleGetSignUpUrl,
        isPending,
        pendingProjectId,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useProject = () => useContext(Context);
