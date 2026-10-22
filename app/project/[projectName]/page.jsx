import React from "react";
import { Item, Row, Section, Text } from "../../components/Receipt/parts";
import ProjectLogo from "../../components/ProjectLogo";
import projectsData from "../projects-data.json";

export const generateStaticParams = () => {
  return Object.keys(projectsData).map((projectName) => ({ projectName }));
};

export const generateMetadata = ({ params }) => {
  const name = params.projectName;
  return {
    title: `${projectsData[name].title} | Arjun Sethi`,
  };
};

const slugs = Object.keys(projectsData);

const Project = ({ params }) => {
  const name = params.projectName;
  const project = projectsData[name];
  const next = slugs[(slugs.indexOf(name) + 1) % slugs.length];

  return (
    <>
      <Section>
        <ProjectLogo
          slug={name}
          title={project.title}
          subtitle={project.subtitle}
          accent={project.accent}
        />
        {project.date && <Row label="Date" value={project.date} />}
        {project.links.map((link) => (
          <Row
            key={link.href}
            label={link.label}
            value="Open ↗"
            href={link.href}
          />
        ))}
      </Section>
      <Section title="Introduction">
        <Text>{project.description}</Text>
      </Section>
      {project.list.length > 0 && (
        <Section title="Features">
          {project.list.map((item, index) => (
            <Item
              key={item.title}
              label={item.title}
              meta={String(index + 1).padStart(2, "0")}
            >
              {item.description}
            </Item>
          ))}
        </Section>
      )}
      <Section>
        {next !== name && (
          <Row
            label="Next project"
            value={`${projectsData[next].title} →`}
            href={`/project/${next}`}
          />
        )}
        <Row label="All projects" value="← Back" href="/#projects" />
      </Section>
    </>
  );
};

export default Project;
