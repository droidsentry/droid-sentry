import { ProjectProvider } from "./components/project-provider";
import ProjectCard from "./components/projects-card";
import { getProjects } from "./lib/projects";

export default async function Page() {
  const projectsData = await getProjects();

  return (
    <div>
      <ProjectProvider projectsData={projectsData}>
        <ProjectCard className="p-6" />
      </ProjectProvider>
    </div>
  );
}
