import React from "react";
import { useCanvas } from "./CanvasContext";

export const ClearCanvasButton = () => {
  const { clearCanvas } = useCanvas();

  return (
    <button
      onClick={clearCanvas}
      className={"text-white"}
    >
      Clear The Canvas
    </button>
  );
};
