"use client";
import styles from "./AppWrapper.module.css";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Header from "../Header";
import Footer from "../Footer";
import Cuts from "../Cuts";

export default function AppWrapper({ children }) {
  const [receiptDim, setReceiptDim] = useState({ width: 0, height: 0 });
  const receiptRef = useRef();
  const pathName = usePathname();
  const ifProjectsRoute = pathName.startsWith("/project");

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      const width = event[0].contentBoxSize[0].inlineSize;
      const height = event[0].contentBoxSize[0].blockSize;
      if (width !== 0 && height !== 0)
        setReceiptDim({
          width,
          height,
        });
    });

    if (receiptRef) {
      resizeObserver.observe(receiptRef.current);
    }
  }, [receiptRef, pathName]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathName]);

  return (
    <motion.div
      key={pathName}
      className={styles.mainContainer}
      initial={{ translateY: 150, opacity: 0.2 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{
        type: "spring",
        duration: 2,
        bounce: 0.4,
      }}
    >
      {/* top cuts */}
      <Cuts receiptDim={receiptDim} position={"top"} />

      {/* receipt */}
      <div ref={receiptRef} className={styles.receipt}>
        <div className={styles.subContainer}>
          {!ifProjectsRoute && (
            <Header
              title={"Arjun Sethi"}
              subtitle={"Software Engineer"}
              description={`Passionate about crafting seamless experiences | Enjoys hiking in
            nature | 8+ years experience`}
            />
          )}
          <div
            className={`${styles.pageContainer} ${
              ifProjectsRoute ? styles.removePageContainerMargin : ""
            }`}
          >
            {children}
            <Footer />
          </div>
        </div>
      </div>

      {/* bottom cuts */}
      <Cuts receiptDim={receiptDim} position={"bottom"} />
    </motion.div>
  );
}
