import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const VideoSessionComponent: React.FC = () => {
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const initializeClient = async () => {
      const response = await fetch("http://localhost:3000/generate-token/TestChannel", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const { token } = await response.json();

      const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(agoraClient);

      await agoraClient.join("YOUR_AGORA_APP_ID", "TestChannel", token);
      const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      await agoraClient.publish([localAudioTrack, localVideoTrack]);
      console.log("Session Started!");
    };

    initializeClient();
  }, []);

  return (
    <div style={{ backgroundColor: "#0052CC", color: "white", padding: "20px", borderRadius: "8px" }}>
      <h1 style={{ color: "#FF7A00" }}>Agora Video Session</h1>
      <p>Your session is live!</p>
    </div>
  );
};

export default VideoSessionComponent;
