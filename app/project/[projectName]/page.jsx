import React from "react";
import ProjectHeader from "../../components/ProjectHeader";
import SectionHeader from "../../components/SectionHeader";
import Padding from "../../components/Padding";
import Description from "../../components/Description";
import Container from "../../components/Container";
import IconContainer from "../../components/IconContainer";
import projectsData from "../projects-data.json";
import BackButton from "../../components/BackButton";

export const generateStaticParams = () => {
  return Object.keys(projectsData);
};

export const generateMetadata = ({ params }) => {
  const name = params.projectName;
  return {
    title: projectsData[name].title,
  };
};

const Project = ({ params }) => {
  const name = params.projectName;

  return (
    <>
      <ProjectHeader
        title={projectsData[name].title}
        subtitle={projectsData[name].subtitle}
      />
      <Padding value={"3%"} />
      <SectionHeader title="Introduction" />
      <Padding value={"3%"} />
      <Description style={{ textAlign: "left", textTransform: "none" }}>
        {projectsData[name].description}
      </Description>
      <Padding value={"4%"} />
      <IconContainer Icon={name} link={projectsData[name].demolink} />
      <Padding value={"4%"} />
      <SectionHeader title="List" />
      <Padding value={"3%"} />
      {projectsData[name].list.map((item, index) => (
        <React.Fragment key={index}>
          <Container
            hoverEffect={false}
            title={`(${index + 1}) ${item.title}`}
            description={item.description}
            titleWidth={"25%"}
            descriptionWidth={"72%"}
            descriptionStyle={{ textAlign: "left" }}
          />
          <Padding value={"3%"} />
        </React.Fragment>
      ))}
      <BackButton />
    </>
  );
};

export default Project;
