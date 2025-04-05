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

    const localVideoRef = useRef<HTMLDivElement>(null);
    const remoteVideoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!channelName) return;

        const fetchToken = async () => {
            try {
                const response = await fetch(
                    `/api/agora/agoraToken?channelName=${channelName}&uid=${UID}`
                );
                if (!response.ok) throw new Error("Failed to fetch token");
                const data = await response.json();
                setToken(data.token);
            } catch (error) {
                console.error("Error fetching token:", error);
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
                if (mediaType === "video" && remoteVideoRef.current) {
                    user.videoTrack?.play(remoteVideoRef.current);
                }
                if (mediaType === "audio") {
                    user.audioTrack?.play();
                }
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

    const toggleCamera = async () => {
        if (localVideoTrack) {
            if (isCameraOn) {
                await localVideoTrack.setEnabled(false);
            } else {
                await localVideoTrack.setEnabled(true);
            }
            setIsCameraOn(!isCameraOn);
        }
    };

    const toggleMic = async () => {
        if (localAudioTrack) {
            if (isMicOn) {
                await localAudioTrack.setEnabled(false);
            } else {
                await localAudioTrack.setEnabled(true);
            }
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
        return <div className="loading">Loading token...</div>;
    }

    return (
        <div className="container">
        <div className="video-call-container">
            <h1 className="title">Video Call - Channel: {channelName}</h1>
            <div className="video-container">
                <div
                    ref={localVideoRef}
                    className="video-box local-video"
                ></div>
                <div
                    ref={remoteVideoRef}
                    className="video-box remote-video"
                ></div>
            </div>
            <div className="controls">
                <button className="control-button" onClick={toggleCamera}>
                    {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
                </button>
                <button className="control-button" onClick={toggleMic}>
                    {isMicOn ? "Mute Mic" : "Unmute Mic"}
                </button>
                <button
                    className="control-button"
                    onClick={raiseHand}
                    disabled={isHandRaised}
                >
                    Raise Hand
                </button>
                <button
                    className="control-button"
                    onClick={lowerHand}
                    disabled={!isHandRaised}
                >
                    Lower Hand
                </button>
            </div>
            </div>
            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background-color: #f0f0f0;
                }
                .video-call-container {
                    font-family: "Roboto", sans-serif;
                    color: black;
                    background: white;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .title {
                    font-size: 2rem;
                    margin-bottom: 20px;
                }
                .video-container {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .video-box {
                    width: 320px;
                    height: 240px;
                    background-color: #000;
                    border: 2px solid green;
                    border-radius: 10px;
                }
                .controls {
                    display: flex;
                    gap: 10px;
                }
                .control-button {
                    background: green;
                    color: #000;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .control-button:hover {
                    background: red;
                    color: #fff;
                }
                .control-button:disabled {
                    background: #555;
                    cursor: not-allowed;
                }
                .loading {
                    font-size: 1.5rem;
                    color: #00eaff;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default dynamic(() => Promise.resolve(VideoCall), { ssr: false });
