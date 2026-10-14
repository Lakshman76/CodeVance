import React, { useRef, useState, useEffect } from "react";

/**
 * LocalPreview
 * - Start camera/mic on button click
 * - Shows local <video> preview (muted so you don't echo)
 * - Mute/unmute and toggle video
 * - Stop and cleanup
 */
const LocalPreview = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false); // UI-only toggle for mic
  const [videoOn, setVideoOn] = useState(true);

  useEffect(() => {
    // cleanup when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  async function startMedia() {
    if (started) return;
    try {
      const constraints = { audio: true, video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStarted(true);
      setMuted(false);
      setVideoOn(true);
    } catch (err) {
      console.error("getUserMedia error:", err);
      alert("Could not access camera/microphone:\n" + err.message);
    }
  }

  function toggleMute() {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((t) => (t.enabled = muted)); // flip
    setMuted((prev) => !prev);
  }

  function toggleVideo() {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach((t) => (t.enabled = !videoOn));
    setVideoOn((prev) => !prev);
  }

  function stopMedia() {
    if (!streamRef.current) return;
    streamRef.current.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStarted(false);
  }

  return (
    <div
      style={{
        display: "inline-block",
        padding: 8,
        border: "1px solid #ddd",
        borderRadius: 6,
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted // keep local preview muted to avoid echo
        playsInline
        style={{ width: 320, height: 240, background: "#000", borderRadius: 4 }}
      />
      <div style={{ marginTop: 8 }}>
        {!started ? (
          <button
            className="px-4 py-2 bg-amber-50 text-gray-900 border border-amber-100 rounded-2xl cursor-pointer hover:bg-amber-200"
            onClick={startMedia}
          >
            Start Camera & Mic
          </button>
        ) : (
          <>
            <button
              className="text-gray-800 border border-red-500 cursor-pointer hover:bg-red-500 hover:text-white px-4 py-2 rounded-md"
              onClick={toggleMute}
            >
              {muted ? "Unmute" : "Mute"}
            </button>
            <button
              className="text-gray-800 border border-red-500 cursor-pointer hover:bg-red-500 hover:text-white px-4 py-2 rounded-md"
              onClick={toggleVideo}
              style={{ marginLeft: 8 }}
            >
              {videoOn ? "Stop Video" : "Start Video"}
            </button>
            <button
              className="text-gray-800 border border-red-500 cursor-pointer hover:bg-red-500 hover:text-white px-4 py-2 rounded-md"
              onClick={stopMedia}
              style={{ marginLeft: 8 }}
            >
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LocalPreview;
