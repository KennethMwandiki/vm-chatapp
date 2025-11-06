import React, { useState } from "react";
import startBroadcast from "./startBroadcast";
import PlatformSelectionUI, { ALL_PLATFORMS } from "./PlatformSelectionUI";

const StreamingComponent: React.FC = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([...ALL_PLATFORMS]);

  return (
    <div>
      <PlatformSelectionUI
        selectedPlatforms={selectedPlatforms}
        setSelectedPlatforms={setSelectedPlatforms}
      />
      <button
        onClick={async () => {
          try {
            const response = await fetch("/generate-token/GlobalEventChannel");
            if (!response.ok) {
              throw new Error("Failed to fetch stream token");
            }
            const { token } = await response.json();
            startBroadcast("GlobalEventChannel", token, selectedPlatforms);
          } catch (error) {
            alert("Error starting broadcast: " + error.message);
          }
        }}
        className="btn-pwa"
        disabled={selectedPlatforms.length === 0}
      >
        Start Multi-Platform Broadcast
      </button>
    </div>
  );
};

export default StreamingComponent;
