"use client";
import React from "react";
import Padding from "../Padding";
import Description from "../Description";
import SectionTitle from "../SectionTitle";
import { motion } from "framer-motion";
import styles from "./CustomDescription.module.css";

const CustomDescription = ({ item }) => {
  return (
    <>
      <motion.div
        className={styles.designationContainer}
        onClick={() => window.open(item.companySite)}
      >
        <motion.span
          whileHover={{
            color: "#FFFFFF",
            backgroundColor: "#242728",
            transition: { duration: 0.5 },
          }}
          className={styles.designation}
        >
          <SectionTitle>{item.title}</SectionTitle>&nbsp;
          <Description
            style={{
              textTransform: "lowercase",
              marginLeft: "-2%",
              marginRight: "-2%",
            }}
          >
            at
          </Description>
          &nbsp;
          <SectionTitle>{item.company}</SectionTitle>&nbsp;
          <svg
            height={20}
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginLeft: "-2%" }}
          >
            <path
              d="M8 21h12.4a.6.6 0 00.6-.6V3.6a.6.6 0 00-.6-.6H3.6a.6.6 0 00-.6.6V16M3.5 20.5L12 12m0 0v4m0-4H8"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </motion.span>
      </motion.div>
      <Padding value={"2%"} />
      <Description style={{ textAlign: "left" }}>
        {item.description}
      </Description>
    </>
  );
};

export default CustomDescription;
