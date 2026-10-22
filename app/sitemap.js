const baseUrl = "https://fishmeister.me";
import projectsData from "./project/projects-data.json";

export default function sitemap() {
  const projectPaths = Object.keys(projectsData).map((name) => ({
    url: `${baseUrl}/project/${name}`,
    lastModified: new Date(),
  }));

  return [{ url: `${baseUrl}/`, lastModified: new Date() }, ...projectPaths];
}
