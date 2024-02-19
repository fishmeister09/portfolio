const baseUrl = "https://fishmeister.me";
import projectsData from "./project/projects-data.json";

export default function sitemap() {
  const projectNames = Object.keys(projectsData);
  const projectPaths = projectNames.map((name) => ({
    url: `${baseUrl}/project/${name}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/links`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/miscellaneous`,
      lastModified: new Date(),
    },
    ...projectPaths,
  ];
}
