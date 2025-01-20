import ProjectCard from "./components/projects-card";
import { getProjects } from "./data/projects";

export default async function Page() {
  const projectsData = await getProjects();
  return (
    <div>
      <ProjectCard projectsData={projectsData} className="p-6" />
    </div>
  );
}
