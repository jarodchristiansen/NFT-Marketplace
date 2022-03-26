import Lottie from "react-lottie";
// import animationData from "../../public/lotties/spiral-loading.json";
import animationData from "../public/lotties/spiral-loading.json";

function LoadingSpinner(props) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      <Lottie
        options={defaultOptions}
        height={300}
        width={300}
        style={{
          cursor: "default",
          position: props?.position ? props.position : "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          top: 100,
          textAlign: "center",
        }}
        isClickToPauseDisabled={true}
      />
    </div>
  );
}

export default LoadingSpinner;
