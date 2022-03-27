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
            ? "fixed outline outline-1 flex flex-col visible top-8 shadow-xl bg-pink-500 w-3/4 md:w-1/2 md:top-32"
            : "hidden"
        }
      >
        <div>
          <ul className={"flex flex-row overflow-hidden"}>
              <button
                  onClick={() => {
                      document.body.style.position = "";
                      document.body.style.overflowY = "auto";
                      setShowModal(false);
                  }}
                  className={"bg-pink-500 text-white mx-8"}
              >
                  Hide Modal
              </button>
              <div>
                  <ClearCanvasButton />
              </div>

          </ul>
        </div>

          <div className={"bg-black"}>
              <div className={"max-w-fit bg-white"}>
                  <Canvas />
              </div>
              <div>
                  <ul className={"flex flex-row overflow-hidden"}>
                      <li className={"mx-8 text-white"}>Tool #1</li>
                      <li className={"mx-8 text-white"}>Tool #2</li>
                      <li className={"mx-8 text-white"}>Tool #3</li>
                      <li className={"mx-8 text-white"}>Tool #4</li>
                  </ul>
              </div>
          </div>

        <div >

        </div>
      </div>

      <div>
          {!showModal && (
              <button
                  className="font-bold mt-8 bg-tahiti-dark text-white rounded p-4 shadow-lg w-5/6"
                  onClick={() => {
                      document.body.style.overflowY = "hidden";
                      // let body = document.getElementsByTagName("body");
                      setShowModal(true);
                  }}
              >
                  Show Modal
              </button>
          )}

      </div>
    </div>
  );
};
export default ModalComponent;
