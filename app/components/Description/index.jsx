"use client";
import styles from "./Description.module.css";

const Description = ({ children, style, navigateTo }) => (
  <p
    className={styles.description}
    style={style}
    onClick={() => {
      if (navigateTo) window.open(navigateTo);
    }}
  >
    {children}
  </p>
);

export default Description;
