import React, { useState } from "react";
import startBroadcast from "../utils/startBroadcast";
import PlatformSelectionUI from "./PlatformSelectionUI";

const ALL_PLATFORMS = [
    "YouTube",
    "Facebook",
    "Twitch",
    "Instagram",
    "LinkedIn",
    "Twitter (X)",
    "WeChat",
    "Kick",
    "Trovo",
    "DLive",
    "Vimeo",
    "TikTok",
    "Custom RTMP"
];

const LiveStreamUI: React.FC = () => {
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [allPlatforms, setAllPlatforms] = useState<string[]>(ALL_PLATFORMS);

    return (
        <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h2>Start Broadcast</h2>
            <PlatformSelectionUI
                allPlatforms={allPlatforms}
                setAllPlatforms={setAllPlatforms}
                selectedPlatforms={selectedPlatforms}
                setSelectedPlatforms={setSelectedPlatforms}
            />
            <button
                onClick={async () => {
                    try {
                        // In a real app, this should fetch a token for the specific channel
                        // For now, we use a hardcoded channel name
                        const channel = "GlobalEventChannel";
                        const response = await fetch(`/generate-token/${channel}`);
                        if (!response.ok) {
                            throw new Error("Failed to fetch stream token");
                        }
                        const { token } = await response.json();
                        startBroadcast(channel, token, selectedPlatforms);
                    } catch (error: any) {
                        alert("Error starting broadcast: " + error.message);
                    }
                }}
                className="btn-primary"
                style={{ marginTop: '20px' }}
                disabled={selectedPlatforms.length === 0}
            >
                Start Multi-Platform Broadcast
            </button>
        </div>
    );
};

export default LiveStreamUI;
