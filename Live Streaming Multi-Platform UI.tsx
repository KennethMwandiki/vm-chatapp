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
        onClick={() => startBroadcast("GlobalEventChannel", "STREAM_TOKEN", selectedPlatforms)}
        className="btn-pwa"
        disabled={selectedPlatforms.length === 0}
      >
        Start Multi-Platform Broadcast
      </button>
    </div>
  );
};

export default StreamingComponent;
