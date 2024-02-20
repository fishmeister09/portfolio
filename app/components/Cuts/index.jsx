"use client";
import { useMemo } from "react";

const Triangle = ({ receiptDim, position }) => {
  const parentWidth = useMemo(() => receiptDim.width, [receiptDim.width]);
  const height = 8;
  const width = height * 2;

  const calculateNumberOfTriangles = () => {
    const numberOfTriangles = Math.floor(parentWidth / width) + 1;
    return numberOfTriangles;
  };

  const numberOfTriangles = calculateNumberOfTriangles();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        width: parentWidth,
        overflow: "hidden",
        marginTop: position == "bottom" ? -height * 0.1 : 0,
        marginBottom: position == "top" ? -height * 0.1 : 0,
        rotate: position === "bottom" ? "180deg" : "0deg",
      }}
    >
      {Array.from({ length: numberOfTriangles }, (_, index) => (
        <svg
          key={index}
          width={width}
          height={height}
          viewBox="0 0 16 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 7H0L8 0L16 7Z" fill="white" />
        </svg>
      ))}
    </div>
  );
};

export default Triangle;
