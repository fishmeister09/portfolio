import styles from "./IconContainer.module.css";
import Image from "next/image";

const IconMap = {
  bundle: "/bundle.png",
  transcribe: "/transcribe.png",
};

const IconContainer = ({ Icon, link }) => {
  return (
    <div
      // onClick={() => window.open(link)}
      className={styles.container}
    >
      <Image
        src={"/icon-background.png"}
        alt="background"
        style={{
          height: "100%",
          width: "100%",
        }}
        layout="fill"
        objectFit="contain"
        priority={true}
      />
      <img
        src={IconMap[Icon]}
        alt={Icon}
        className={styles.icon}
        loading="eager"
      />
    </div>
  );
};
export default IconContainer;
