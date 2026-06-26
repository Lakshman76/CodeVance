import { useEffect } from "react";

const useCodeSync = ({ socket, roomId, code, setCode }) => {
  // Receive live code changes
  useEffect(() => {
    const handleCodeChange = ({ roomId: incomingRoom, code }) => {
      if (incomingRoom !== roomId) return;

      setCode((prev) => (prev !== code ? code : prev));
    };

    socket.on("code-change", handleCodeChange);

    return () => {
      socket.off("code-change", handleCodeChange);
    };
  }, [socket, roomId, setCode]);

  // Send current code to newly joined user
  useEffect(() => {
    const handleRequestCode = ({ targetSocketId }) => {
      socket.emit("send-code", {
        targetSocketId,
        code,
      });
    };

    socket.on("request-code", handleRequestCode);

    return () => {
      socket.off("request-code", handleRequestCode);
    };
  }, [socket, roomId, code]);

  // Receive initial code
  useEffect(() => {
    const handleReceiveCode = ({
      roomId: incomingRoom,
      code: incomingCode,
    }) => {
      if (incomingRoom !== roomId) return;

      setCode((prev) => (prev !== incomingCode ? incomingCode : prev));
    };

    socket.on("receive-code", handleReceiveCode);

    return () => {
      socket.off("receive-code", handleReceiveCode);
    };
  }, [socket, roomId, setCode]);
};

export default useCodeSync;
