import React from "react";
import {
  Callout,
  Entry,
  Item,
  Row,
  Section,
  Text,
} from "./components/Receipt/parts";
import Portrait from "./components/Portrait";
import { ProjectItem } from "./components/ProjectLogo";
import projectsData from "./project/projects-data.json";
import { contact, education, profile, skills, timeline } from "./data/profile";

export default function Home() {
  return (
    <>
      <Section title="Served by">
        <Portrait
          src="/portrait.jpg"
          alt={profile.name}
          name={profile.name}
          caption={profile.role}
          rows={100}
          color="#1155CC"
        />
        <div style={{ marginTop: 14 }}>
          <Text>{profile.about}</Text>
        </div>
      </Section>

      <Section title="Projects" id="projects">
        {Object.entries(projectsData).map(([slug, project]) => (
          <ProjectItem key={slug} slug={slug} project={project} />
        ))}
      </Section>

      <Section title="Experience" id="experience">
        {timeline.map((job) => (
          <Entry
            key={job.span}
            label={
              <>
                {job.title} @{" "}
                {job.companySite ? (
                  <a href={job.companySite} target="_blank" rel="noreferrer">
                    {job.company} ↗
                  </a>
                ) : (
                  job.company
                )}
              </>
            }
            meta={job.span}
            sub={job.summary}
          />
        ))}
      </Section>

      <Section title="Education">
        <Entry
          label={education.degree}
          meta={education.span}
          sub={`${education.field} · ${education.school}, ${education.location}`}
        />
      </Section>

      <Section title="Skills" id="skills">
        {skills.map(({ group, items }) => (
          <Item key={group} label={group}>
            {items.join(" · ")}
          </Item>
        ))}
      </Section>

      <Section title="Contact" id="contact">
        <Callout href={`mailto:${profile.email}`}>
          Let&#39;s build something together
        </Callout>
        {contact.map((link) => (
          <Row key={link.label} label={link.label} value={link.value} href={link.href} />
        ))}
      </Section>
    </>
  );
}
