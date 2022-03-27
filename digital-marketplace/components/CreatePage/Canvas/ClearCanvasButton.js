import React from "react";
import { useCanvas } from "./CanvasContext";

export const ClearCanvasButton = () => {
  const { clearCanvas } = useCanvas();

  return (
    <button
      onClick={clearCanvas}
      className={"bg-tahiti-dark text-white w-full"}
    >
      Clear The Canvas
    </button>
  );
};
