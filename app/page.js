// "use client";
import React from "react";
import Padding from "./components/Padding";
import SectionHeader from "./components/SectionHeader";
import Container from "./components/Container";
import projectsData from "./project/projects-data.json";

const projects = Object.values(projectsData);
export default function Home() {
  return (
    <>
      <Padding value={"3%"} />
      <SectionHeader title="Selected Projects" />
      <Padding value={"3%"} />
      {projects.map((project, index) => (
        <React.Fragment key={index}>
          <Container
            navigateTo={`/project/${project.title.toLowerCase()}`}
            title={`[${project.title}]`}
            description={project.miniDescription}
            titleWidth={"25%"}
            descriptionWidth={"72%"}
            descriptionStyle={{ textAlign: "left" }}
          />
          <Padding value={"2%"} />
        </React.Fragment>
      ))}
      {/* <Padding value={'4%'} />
   

      {/ * <SectionHeader title="Selected Projects" />
      <Padding value={'3%'} />
      {projects.map((project) => (
        <>
          <Container
            key={project.title}
            title={project.title}
            description={project.description}
            imageUri={project.imageUri}
          />
          <Padding value={'2%'} />
        </>
      ))} */}
    </>
  );
}
