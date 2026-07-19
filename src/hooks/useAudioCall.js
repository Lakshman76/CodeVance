import { useRef } from "react";

const useAudioCall = () => {
  const localStream = useRef(null);
  const peerConnections = useRef({});
  const socketRef = useRef(null);
  const remoteAudios = useRef({});

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      localStream.current = stream;

      console.log("🎤 Microphone ready");

      return stream;
    } catch (err) {
      console.error(err);

      throw err;
    }
  };

  const stopMicrophone = () => {
  if (!localStream.current) return;

  localStream.current
    .getAudioTracks()
    .forEach((track) => (track.enabled = false));

  console.log("🔇 Microphone muted");
};

const unmuteMicrophone = async () => {
  // First time
  if (!localStream.current) {
    return await startMicrophone();
  }

  localStream.current
    .getAudioTracks()
    .forEach((track) => (track.enabled = true));

  console.log("🎤 Microphone unmuted");

  return localStream.current;
};

  const createPeerConnection = (remoteSocketId, socket) => {
    // Return existing connection if already created
    if (peerConnections.current[remoteSocketId]) {
      return peerConnections.current[remoteSocketId];
    }

    const peer = new RTCPeerConnection(rtcConfig);

    // Send ICE candidates to the remote peer
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          target: remoteSocketId,
          candidate: event.candidate,
        });

        console.log("🧊 ICE candidate sent");
      }
    };

    peer.ontrack = (event) => {
      console.log("🔊 Remote audio received");

      let audio = remoteAudios.current[remoteSocketId];

      if (!audio) {
        audio = document.createElement("audio");
        audio.autoplay = true;
        audio.playsInline = true;

        remoteAudios.current[remoteSocketId] = audio;
      }

      audio.srcObject = event.streams[0];

      audio.play().catch(console.error);
    };

    // Add microphone tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStream.current);
      });
    }

    // Store this peer connection
    peerConnections.current[remoteSocketId] = peer;

    console.log("✅ Peer created:", remoteSocketId);

    return peer;
  };

  const createOffer = async (socket, remoteSocketId) => {
    try {
      const peer = createPeerConnection(remoteSocketId, socket);

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("offer", {
        target: remoteSocketId,
        offer,
      });

      console.log("📤 Offer sent");
    } catch (err) {
      console.error(err);
    }
  };

  const handleOffer = async (socket, sender, offer) => {
    try {
      const peer = createPeerConnection(sender, socket);

      await peer.setRemoteDescription(offer);

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("answer", {
        target: sender,
        answer,
      });

      console.log("📥 Offer received");
      console.log("📤 Answer sent");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnswer = async (sender, answer) => {
    try {
      const peer = peerConnections.current[sender];

      if (!peer) {
        console.log("Peer not found");
        return;
      }

      await peer.setRemoteDescription(answer);

      console.log("✅ Answer received");
      console.log("🎉 WebRTC connection established");
    } catch (err) {
      console.error(err);
    }
  };

  const setSocket = (socket) => {
    socketRef.current = socket;
  };

  const handleIceCandidate = async (sender, candidate) => {
    try {
      const peer = peerConnections.current[sender];

      if (!peer) {
        console.log("Peer not found");
        return;
      }

      await peer.addIceCandidate(new RTCIceCandidate(candidate));

      console.log("🧊 ICE candidate added");
    } catch (err) {
      console.error(err);
    }
  };

  const addAudioTrackToPeers = () => {
    if (!localStream.current) return;

    Object.values(peerConnections.current).forEach((peer) => {
      const alreadyAdded = peer
        .getSenders()
        .some((sender) => sender.track?.kind === "audio");

      if (alreadyAdded) return;

      localStream.current.getAudioTracks().forEach((track) => {
        peer.addTrack(track, localStream.current);
      });

      console.log("🎤 Audio track added");
    });
  };

  const rtcConfig = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
      },
    ],
  };

  return {
    localStream,
    peerConnections,
    startMicrophone,
    stopMicrophone,
    createPeerConnection,
    createOffer,
    handleOffer,
    handleAnswer,
    setSocket,
    handleIceCandidate,
    addAudioTrackToPeers,
    unmuteMicrophone
  };
};

export default useAudioCall;
