import React, { useEffect } from "react";
import { useCanvas } from "./CanvasContext";

export function Canvas() {
  const { canvasRef, prepareCanvas, startDrawing, finishDrawing, draw } =
    useCanvas();

  useEffect(() => {
    prepareCanvas();
  }, []);

  return (
    <canvas
      // onMouseDown={startDrawing}
      // onMouseUp={finishDrawing}
      onPointerDown={startDrawing}
      onPointerUp={finishDrawing}
      onPointerMove={draw}
      // onMouseMove={draw}
      ref={canvasRef}
      className={"outline outline-2 outline-black"}
    />
  );
}
