import React from "react";
import Padding from "../components/Padding";
import SectionHeader from "../components/SectionHeader";
import Container from "../components/Container";
import links from "./links.json";

export const metadata = {
  title: "Links | Arjun Sethi",
};

const Links = () => {
  const mainLinks = links["main links"];
  const socialLinks = links["social links"];

  return (
    <>
      <Padding value={"3%"} />
      <SectionHeader title="Main Links" />
      <Padding value={"3%"} />
      {mainLinks.map((link, index) => (
        <React.Fragment key={index}>
          <Container
            // onClick={() => window.open(link.ref)}
            navigateTo={link.ref}
            title={link.title}
            description={link["link-text"]}
            titleWidth={"50%"}
            descriptionWidth={"50%"}
            descriptionStyle={{
              textAlign: "right",
              textTransform: "none",
            }}
          />
          <Padding value={"1%"} />
        </React.Fragment>
      ))}
      <Padding value={"4%"} />
      <SectionHeader title="Social Links" />
      <Padding value={"3%"} />
      {socialLinks.map((link, index) => (
        <React.Fragment key={index}>
          <Container
            // onClick={() => window.open(link.ref)}
            navigateTo={link.ref}
            title={link.title}
            description={link["link-text"]}
            titleWidth={"50%"}
            descriptionWidth={"50%"}
            descriptionStyle={{
              textAlign: "right",
              textTransform: "lowercase",
            }}
          />
          <Padding value={"1%"} />
        </React.Fragment>
      ))}
    </>
  );
};

export default Links;
