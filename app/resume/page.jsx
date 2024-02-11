import React from "react";
import Padding from "../components/Padding";
import SectionHeader from "../components/SectionHeader";
import Description from "../components/Description";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";
import CustomDescription from "../components/CustomDescription";
import { skills, timeline } from "./data";

export const metadata = {
  title: "Resume",
};

const Resume = () => {
  return (
    <>
      <Padding value={"3%"} />
      <SectionHeader title="About Me" />
      <Padding value={"3%"} />
      <Description style={{ textAlign: "left", textTransform: "none" }}>
        With a profound love for crafting exceptional digital experiences,
        I&#39;ve dedicated my journey as a software engineer to building
        innovative solutions that transcend boundaries. My work is characterized
        by a commitment to seamless functionality, elegant design, and a
        relentless drive to overcome challenges.
      </Description>
      <Padding value={"4%"} />
      <SectionHeader title="Timeline" />
      <Padding value={"3%"} />
      {timeline.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <Container
              title={item.span}
              titleWidth={"25%"}
              customDescription={<CustomDescription item={item} />}
              descriptionWidth={"72%"}
              descriptionStyle={{
                textAlign: "left",
              }}
              hoverEffect={false}
            />
            <Padding value={"3%"} />
          </React.Fragment>
        );
      })}
      <Padding value={"4%"} />
      <SectionHeader title="Skills" />
      <Padding value={"3%"} />
      {skills.map((skill, i) => {
        if (i % 2 === 0) {
          return (
            <React.Fragment key={i}>
              <Container
                title={skill}
                customDescription={<SectionTitle>{skills[i + 1]}</SectionTitle>}
                titleWidth={"50%"}
                descriptionWidth={"50%"}
                descriptionStyle={{
                  textAlign: "left",
                }}
                hoverEffect={false}
              />
              <Padding value={"1%"} />
            </React.Fragment>
          );
        }
        return null;
      })}
    </>
  );
};

export default Resume;
