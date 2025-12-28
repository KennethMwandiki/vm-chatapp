import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const SessionManager: React.FC = () => {
    const [client, setClient] = useState<any>(null);
    const [joined, setJoined] = useState(false);

    const startSession = async () => {
        try {
            const channel = "TestChannel";
            const response = await fetch(`/generate-token/${channel}`);
            if (!response.ok) {
                throw new Error("Failed to fetch token");
            }
            const { token } = await response.json();

            const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
            setClient(agoraClient);

            const appId = import.meta.env.VITE_AGORA_APP_ID;
            if (!appId) {
                console.error("VITE_AGORA_APP_ID is missing");
                return;
            }

            await agoraClient.join(appId, channel, token);
            const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            const localVideoTrack = await AgoraRTC.createCameraVideoTrack();

            await agoraClient.publish([localAudioTrack, localVideoTrack]);
            console.log("Session Started!");
            setJoined(true);
        } catch (err) {
            console.error("Failed to join session", err);
        }
    };

    return (
        <div style={{ backgroundColor: "#0052CC", color: "white", padding: "20px", borderRadius: "8px" }}>
            <h2 style={{ color: "#FF7A00" }}>Agora Video Session</h2>
            {!joined ? (
                <button onClick={startSession} className="btn-secondary" style={{ color: 'white', borderColor: 'white' }}>
                    Join Session
                </button>
            ) : (
                <p>Your session is live!</p>
            )}
        </div>
    );
};

export default SessionManager;
