import React, { useContext, useRef, useState } from "react";

const CanvasContext = React.createContext();

export const CanvasProvider = ({ children }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    // canvas.width = window.innerWidth * 2;
    // canvas.height = window.innerHeight * 2;
    // canvas.style.maxWidth = `${window.innerWidth / 2}px`;
    // canvas.style.height = `${window.innerHeight}px`;
    // canvas.style.position = "relative";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    if (window?.innerWidth > 400) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    console.log(
      "this is the window.innerWidth/height",
      window.innerWidth,
      window.innerHeight
    );

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 5;
    contextRef.current = context;
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    // document.body.style.height = "100vh";
    // document.body.style.position = "fixed";
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);

  };

  const draw = (e) => {
    const { nativeEvent } = e;
    // e.preventDefault();
    e.stopPropagation();
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    if (offsetX && offsetY) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    } else if (e.touches[0].clientX && e.touches[0].clientY) {
      contextRef.current.lineTo(e.touches[0].clientX, e.touches[0].clientY);
      contextRef.current.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        contextRef,
        prepareCanvas,
        startDrawing,
        finishDrawing,
        clearCanvas,
        draw,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
