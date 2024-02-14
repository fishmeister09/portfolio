"use client";
import SectionTitle from "../SectionTitle";
import Description from "../Description";
import styles from "./Container.module.css";
import { motion } from "framer-motion";
import Link from "next/link";
const Container = ({
  title,
  description,
  titleWidth,
  descriptionWidth,
  descriptionStyle,
  customDescription,
  hoverEffect = true,
  navigateTo = "",
}) => {
  return (
    <motion.div
      // onClick={() => router.push(navigateTo)}
      style={{ cursor: hoverEffect ? "pointer" : "default" }}
      whileHover={
        hoverEffect && {
          color: "#FFFFFF",
          backgroundColor: "#242728",
          transition: { duration: 0.5 },
        }
      }
    >
      <Link href={navigateTo} className={styles.container}>
        <div style={{ width: titleWidth }}>
          <SectionTitle>{title}</SectionTitle>
        </div>
        <div style={{ width: descriptionWidth }}>
          {customDescription ? (
            customDescription
          ) : (
            <Description style={descriptionStyle}>{description}</Description>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
export default Container;
