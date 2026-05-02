import React, { useEffect, useRef, useState } from "react";
import { IconButton, TextField, Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";

import styles from "../styles/videoComponent.module.css";
import server from "../environment";

const peerConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeet() {
    const wsRef = useRef(null);
    const localVideoRef = useRef(null);
    const streamRef = useRef(null);
    const connections = useRef({});

    const [videos, setVideos] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [join, setJoin] = useState(true);

    const [videoOn, setVideoOn] = useState(true);
    const [audioOn, setAudioOn] = useState(true);
    const [screenShare, setScreenShare] = useState(false);

    // 1. WebSocket Signaling Setup
    const connectWS = () => {
        const WS_URL = server?.startsWith("https") ? server.replace("https", "wss") : server.replace("http", "ws");
        wsRef.current = new WebSocket(`${WS_URL}/ws/room1`);

        wsRef.current.onopen = () => {
            wsRef.current.send(JSON.stringify({ type: "join", sender: username }));
        };

        wsRef.current.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "chat") {
                setMessages((prev) => [...prev, data]);
            }

            if (data.type === "offer") {
                const pc = createPeer(data.sender);
                await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                wsRef.current.send(JSON.stringify({ type: "answer", sdp: answer, sender: username, target: data.sender }));
            }

            if (data.type === "answer") {
                const pc = connections.current[data.sender];
                if (pc) await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
            }

            if (data.type === "ice") {
                const pc = connections.current[data.sender];
                if (pc) await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        };
    };

    // 2. Peer Connection Logic
    const createPeer = (id) => {
        const pc = new RTCPeerConnection(peerConfig);
        connections.current[id] = pc;

        // Tracks add karein
        streamRef.current.getTracks().forEach((track) => pc.addTrack(track, streamRef.current));

        pc.ontrack = (event) => {
            setVideos((prev) => {
                const exists = prev.find((v) => v.socketId === id);
                if (exists) return prev;
                return [...prev, { socketId: id, stream: event.streams[0] }];
            });
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                wsRef.current.send(JSON.stringify({ type: "ice", candidate: event.candidate, sender: username, target: id }));
            }
        };

        return pc;
    };

    // 3. Media Controls
    const joinCall = async () => {
        if (!username.trim()) return alert("Enter username");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            setJoin(false);
            connectWS();
        } catch (err) {
            alert("Camera access denied");
        }
    };

    const handleScreenShare = async () => {
        try {
            if (!screenShare) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];

                Object.values(connections.current).forEach(pc => {
                    const sender = pc.getSenders().find(s => s.track.kind === 'video');
                    sender.replaceTrack(screenTrack);
                });

                if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;

                screenTrack.onended = () => stopScreenShare();
                setScreenShare(true);
            } else {
                stopScreenShare();
            }
        } catch (err) { console.error(err); }
    };

    const stopScreenShare = () => {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        Object.values(connections.current).forEach(pc => {
            const sender = pc.getSenders().find(s => s.track.kind === 'video');
            sender.replaceTrack(videoTrack);
        });
        if (localVideoRef.current) localVideoRef.current.srcObject = streamRef.current;
        setScreenShare(false);
    };

    const sendMessage = () => {
        if (!message.trim()) return;
        wsRef.current.send(JSON.stringify({ type: "chat", message, sender: username }));
        setMessage("");
    };

    return (
        <div className={styles.container}>
            {join ? (
                <div className={styles.lobby}>
                    <h2>Join Meeting</h2>
                    <TextField value={username} onChange={(e) => setUsername(e.target.value)} label="Username" variant="outlined" />
                    <Button variant="contained" onClick={joinCall}>Join</Button>
                </div>
            ) : (
                <div className={styles.meetingWrapper}>
                    <div className={styles.videoArea}>
                        <div className={styles.videoGrid}>
                            {videos.map((v) => (
                                <video key={v.socketId} autoPlay playsInline ref={(el) => { if (el) el.srcObject = v.stream; }} />
                            ))}
                        </div>
                        <div className={styles.localVideoContainer}>
                            <video ref={localVideoRef} autoPlay muted playsInline />
                        </div>
                        <div className={styles.controlBar}>
                            <IconButton onClick={() => { 
                                streamRef.current.getVideoTracks()[0].enabled = !videoOn; 
                                setVideoOn(!videoOn); 
                            }} className={styles.iconBtn}>
                                {videoOn ? <VideocamIcon /> : <VideocamOffIcon color="error" />}
                            </IconButton>
                            <IconButton className={styles.endCall} onClick={() => window.location.reload()}><CallEndIcon /></IconButton>
                            <IconButton onClick={() => { 
                                streamRef.current.getAudioTracks()[0].enabled = !audioOn; 
                                setAudioOn(!audioOn); 
                            }} className={styles.iconBtn}>
                                {audioOn ? <MicIcon /> : <MicOffIcon color="error" />}
                            </IconButton>
                            <IconButton onClick={handleScreenShare} className={styles.iconBtn}>
                                {screenShare ? <StopScreenShareIcon color="error" /> : <ScreenShareIcon />}
                            </IconButton>
                        </div>
                    </div>
                    <div className={styles.chatSidebar}>
                        <div className={styles.chatHeader}><h2>Chat</h2></div>
                        <div className={styles.messagesContainer}>
                            {messages.map((m, i) => (
                                <div key={i}><strong>{m.sender}:</strong> {m.message}</div>
                            ))}
                        </div>
                        <div className={styles.chatInput}>
                            <input placeholder="Enter Your chat" value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button onClick={sendMessage}>SEND</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}