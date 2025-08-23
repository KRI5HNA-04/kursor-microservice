import React from "react";
import Silk from "./Components/ui/Silk";

const Background = () => {
  return (
    <div>
      <Silk
        speed={5}
        scale={1}
        color="#7B7481"
        noiseIntensity={1.5}
        rotation={0}
      />
    </div>
  );
};

export default Background;
