"use client";
import SectionTitle from "../SectionTitle";
import Description from "../Description";
import styles from "./Container.module.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Container = ({
  title,
  description,
  titleWidth,
  descriptionWidth,
  descriptionStyle,
  navigateTo,
  customDescription,
  hoverEffect = true,
}) => {
  const router = useRouter();
  return (
    <motion.div
      onClick={() => router.push(navigateTo)}
      className={styles.container}
      style={{ cursor: hoverEffect ? "pointer" : "default" }}
      whileHover={
        hoverEffect && {
          color: "#FFFFFF",
          backgroundColor: "#242728",
          transition: { duration: 0.5 },
        }
      }
    >
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
    </motion.div>
  );
};
export default Container;
