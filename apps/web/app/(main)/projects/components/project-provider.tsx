"use client";

import { getSignUpUrl } from "@/lib/actions/emm/enterprise";
import { ProjectWithEnterpriseRelation } from "@/lib/types/project";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { deleteProject } from "../actions";

type ContextType = {
  projects: ProjectWithEnterpriseRelation[];
  handleProjectDelete: (projectId: string) => void;
  // handleGetSignUpUrl: (projectId: string, projectName: string) => void;
  isPending: boolean;
  pendingProjectId: string | null;
};

const Context = createContext<ContextType>({} as ContextType);

export function ProjectProvider({
  children,
  projectsSource,
}: {
  children: ReactNode;
  projectsSource: ProjectWithEnterpriseRelation[];
}) {
  const [projects, setProjects] =
    useState<ProjectWithEnterpriseRelation[]>(projectsSource);

  const [isPending, startTransition] = useTransition();
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
  const handleProjectDelete = async (projectId: string) => {
    setPendingProjectId(projectId);
    startTransition(async () => {
      // await new Promise((resolve) => setTimeout(resolve, 100000));
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.project_id !== projectId));
      setPendingProjectId(null);
    });
  };

  return (
    <Context.Provider
      value={{
        projects,
        handleProjectDelete,
        // handleGetSignUpUrl,
        isPending,
        pendingProjectId,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useProject = () => useContext(Context);
