import { checkProjectLimit } from "@/lib/service";
import { ProjectProvider } from "./components/project-provider";
import ProjectsCardList from "./components/projects-card-list";
import { getProjects } from "./lib/projects";

export default async function Page() {
  const projectsSource = await getProjects();
  const isProjectLimit = await checkProjectLimit();

  return (
    <div>
      <ProjectProvider projectsSource={projectsSource}>
        <ProjectsCardList className="p-6" isProjectLimit={isProjectLimit} />
      </ProjectProvider>
    </div>
  );
}
