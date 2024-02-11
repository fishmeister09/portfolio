// import Random from '/public/random.jpg';
import React from "react";
import styles from "./Miscellaneous.module.css";
import Description from "../components/Description";
import Padding from "../components/Padding";
import SectionHeader from "../components/SectionHeader";
import quotesData from "./quotes.json";

export const metadata = {
  title: "Miscellaneous",
};

const Miscellaneous = () => {
  const quotes = Object.values(quotesData);
  return (
    <>
      <Padding value={"3%"} />
      <SectionHeader title="Had to put something here" />
      {quotes.map((item, index) => (
        <React.Fragment key={index}>
          <Padding value={"3%"} />
          <Description
            style={{
              textTransform: "none",
              cursor: "pointer",
            }}
            navigateTo={item.ref}
          >
            “{item.quote}”
          </Description>
          <div className={styles.author}>― {item.author}</div>
          <Padding value={"3%"} />
        </React.Fragment>
      ))}
    </>
  );
};
export default Miscellaneous;
