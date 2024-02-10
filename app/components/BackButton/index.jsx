"use client";
import { motion } from "framer-motion";
import styles from "./BackButton.module.css";
import SectionTitle from "../SectionTitle";
import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <motion.div
      onClick={() => router.back()}
      className={styles.container}
      whileHover={{
        color: "#242728",
        backgroundColor: "#FFFFFF",
        transition: { duration: 0.5 },
      }}
    >
      <motion.svg
        width="100%"
        height="1.5em"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color="inherit"
      >
        <path
          d="M18.5 12H6m0 0l6-6m-6 6l6 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </motion.svg>
      <SectionTitle>Back</SectionTitle>
    </motion.div>
  );
};
export default BackButton;
