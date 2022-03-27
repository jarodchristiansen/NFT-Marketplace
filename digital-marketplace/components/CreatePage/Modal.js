import { useState, useEffect } from "react";
import { Canvas } from "./Canvas/Canvas";
import { ClearCanvasButton } from "./Canvas/ClearCanvasButton";

const ModalComponent = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className={"relative"}>
      <div
        className={
          showModal
            ? "fixed outline outline-1 flex flex-col visible top-24 shadow-xl bg-pink-500 w-2/3 md:w-1/2"
            : "hidden"
        }
      >
        <div>
          <ul className={"flex flex-row"}>
            <li className={"mx-8 text-white"}>Tool #1</li>
            <li className={"mx-8 text-white"}>Tool #2</li>
            <li className={"mx-8 text-white"}>Tool #3</li>
            <li className={"mx-8 text-white"}>Tool #4</li>
          </ul>
        </div>
        <div className={"max-w-fit bg-white"}>
          <Canvas />
          <ClearCanvasButton />
        </div>
        <div>
          <button
            onClick={() => {
              setShowModal(false);
            }}
            className={"bg-pink-500 text-white w-full"}
          >
            Hide Modal
          </button>
        </div>
      </div>

      <div>
        <button
          onClick={() => {
            // let body = document.getElementsByTagName("body");
            setShowModal(true);
          }}
        >
          Show Modal
        </button>
      </div>
    </div>
  );
};
export default ModalComponent;
