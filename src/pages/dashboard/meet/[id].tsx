// pages/dashboard/meet/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
const UID = Math.floor(Math.random() * 100000);

const VideoCall = () => {
  const router = useRouter();
  const { id: channelName } = router.query;

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agoraClient, setAgoraClient] = useState<any>(null);

  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!channelName) return;

    const fetchToken = async () => {
      try {
        const response = await fetch(
          `/api/agora/agoraToken?channelName=${channelName}&uid=${UID}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Token fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [channelName]);

  useEffect(() => {
    if (!token || !channelName) return;

    const initAgora = async () => {
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setAgoraClient(client);

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setRemoteUsers((prev) => [...prev, user]);
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user) => {
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      await client.join(APP_ID, channelName as string, token, UID);

      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      setLocalVideoTrack(videoTrack);
      setLocalAudioTrack(audioTrack);

      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      await client.publish([videoTrack, audioTrack]);
    };

    initAgora();

    return () => {
      agoraClient?.leave();
    };
  }, [token, channelName]);

  useEffect(() => {
    // Play remote videos in refs
    remoteUsers.forEach((user, i) => {
      if (remoteVideoRefs.current[i]) {
        user.videoTrack?.play(remoteVideoRefs.current[i]);
      }
    });
  }, [remoteUsers]);

  const toggleCamera = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const raiseHand = () => {
    setIsHandRaised(true);
    console.log("Hand raised");
  };

  const lowerHand = () => {
    setIsHandRaised(false);
    console.log("Hand lowered");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-blue-500">
        Loading token...
      </div>
    );
  }

  const totalUsers = 1 + remoteUsers.length; // local + remote
  const gridCols =
    totalUsers === 1
      ? "grid-cols-1"
      : totalUsers === 2
      ? "grid-cols-2"
      : totalUsers <= 4
      ? "grid-cols-2"
      : totalUsers <= 6
      ? "grid-cols-3"
      : "grid-cols-4";

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="text-center py-4 shadow bg-white text-xl font-semibold">
        Meet – Channel: {channelName}
      </header>

      {/* Video Grid */}
      <div className={`flex-1 grid gap-4 p-4 ${gridCols}`}>
        {/* Local video */}
        <div
          ref={localVideoRef}
          className="bg-black rounded-xl shadow-lg aspect-video"
        ></div>

        {/* Remote videos */}
        {remoteUsers.map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) {
                remoteVideoRefs.current[i] = el;
              }
            }}
            className="bg-black rounded-xl shadow-lg aspect-video"
          ></div>
        ))}
      </div>

      {/* Controls */}
      {/* Controls */}
<div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white shadow-xl rounded-full px-6 py-3 flex gap-4">
    <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition"
        onClick={toggleCamera}
    >
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
    </button>
    <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition"
        onClick={toggleMic}
    >
        {isMicOn ? "Mute Mic" : "Unmute Mic"}
    </button>4
    <button
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition"
        onClick={() => {
            agoraClient?.leave(); // Leave the Agora channel
            router.push("/dashboard"); // Redirect to /dashboard
        }}
    >
        Leave
    </button>
</div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(VideoCall), { ssr: false });
