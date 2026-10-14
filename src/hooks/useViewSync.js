import { useEffect } from "react";

const VALID_VIEWS = ["code", "whiteboard"];

const useViewSync = ({ socket, roomId, view, setView }) => {
  // Live view changes from others
  useEffect(() => {
    const handleViewChange = ({ roomId: incomingRoom, view: incoming }) => {
      if (incomingRoom !== roomId || !VALID_VIEWS.includes(incoming)) return;
      setView(incoming);
    };

    socket.on("view-change", handleViewChange);
    return () => socket.off("view-change", handleViewChange);
  }, [socket, roomId, setView]);

  // Tell a newly joined user which view the room is on
  useEffect(() => {
    const handleRequest = ({ targetSocketId }) => {
      socket.emit("send-view", { targetSocketId, view });
    };

    socket.on("request-code", handleRequest);
    return () => socket.off("request-code", handleRequest);
  }, [socket, view]);

  // Receive the room's current view when joining
  useEffect(() => {
    const handleReceive = ({ roomId: incomingRoom, view: incoming }) => {
      if (incomingRoom !== roomId || !VALID_VIEWS.includes(incoming)) return;
      setView(incoming);
    };

    socket.on("receive-view", handleReceive);
    return () => socket.off("receive-view", handleReceive);
  }, [socket, roomId, setView]);
};

export default useViewSync;