import React from "react";
import styles from "./Header.module.css";
import HeaderSubtitle from "../HeaderSubtitle";
import Description from "../Description";
import Padding from "../Padding";
import { usePathname } from "next/navigation";
const Header = () => {
  const pathName = usePathname();

  return (
    <>
      <h1 className={styles.name}>Arjun Sethi</h1>
      <HeaderSubtitle>Software Developer</HeaderSubtitle>
      {pathName === "/" && (
        <React.Fragment>
          <Padding value={"3%"} />
          <Description>
            Transforming ideas into functional software | Enjoys hiking in
            nature
          </Description>
        </React.Fragment>
      )}
    </>
  );
};
export default Header;
