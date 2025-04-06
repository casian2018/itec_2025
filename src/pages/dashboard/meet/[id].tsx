// pages/dashboard/meet/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { db } from "@/pages/api/firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

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

  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRefs = useRef<HTMLDivElement[]>([]);

  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ text: string }[]>([]);

  // Fetch token
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

  // Init Agora
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

  // Play remote videos
  useEffect(() => {
    remoteUsers.forEach((user, i) => {
      if (remoteVideoRefs.current[i]) {
        user.videoTrack?.play(remoteVideoRefs.current[i]);
      }
    });
  }, [remoteUsers]);

  // Chat real-time listener
  useEffect(() => {
    if (!channelName) return;

    const messagesRef = collection(db, "chats", channelName as string, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data() as { text: string });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [channelName]);

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

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: chatInput,
        channelName,
      }),
    });

    setChatInput("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-blue-500">
        Loading token...
      </div>
    );
  }

  const totalUsers = 1 + remoteUsers.length;
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
        <div
          ref={localVideoRef}
          className="bg-black rounded-xl shadow-lg aspect-video"
        ></div>

        {remoteUsers.map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) remoteVideoRefs.current[i] = el;
            }}
            className="bg-black rounded-xl shadow-lg aspect-video"
          ></div>
        ))}
      </div>

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
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition"
          onClick={() => {
            agoraClient?.leave();
            router.push("/dashboard");
          }}
        >
          Leave
        </button>
      </div>

      {/* Chat Box */}
      <div className="fixed bottom-28 right-5 w-80 max-h-[60vh] bg-white rounded-xl shadow-lg flex flex-col">
        <div className="bg-blue-600 text-white font-semibold p-3 rounded-t-xl">Event Chat</div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className="bg-gray-200 p-2 rounded text-sm">{msg.text}</div>
          ))}
        </div>
        <div className="flex border-t p-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-1 text-sm border rounded-l-md outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-r-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(VideoCall), { ssr: false });