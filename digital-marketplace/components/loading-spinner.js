import Lottie from "react-lottie";
// import animationData from "../../public/lotties/spiral-loading.json";
import animationData from "../public/lotties/spiral-loading.json";

function LoadingSpinner() {
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
                height={400}
                width={400}
                style={{
                    cursor: "default",
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    top: 200,
                    textAlign: "center",
                }}
                isClickToPauseDisabled={true}
            />
        </div>
    );
}

export default LoadingSpinner;