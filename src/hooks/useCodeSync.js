import { useEffect } from "react";

const useCodeSync = ({
  socket,
  roomId,
  code,
  setCode,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  // Receive live code changes
  useEffect(() => {
    const handleCodeChange = ({ roomId: incomingRoom, code }) => {
      if (incomingRoom !== roomId) return;
      setCode((prev) => (prev !== code ? code : prev));
    };

    socket.on("code-change", handleCodeChange);
    return () => socket.off("code-change", handleCodeChange);
  }, [socket, roomId, setCode]);

  // Receive language changes (language + its starter code together)
  useEffect(() => {
    const handleLanguageChange = ({ roomId: incomingRoom, language, code }) => {
      if (incomingRoom !== roomId) return;
      setSelectedLanguage(language);
      setCode(code);
    };

    socket.on("language-change", handleLanguageChange);
    return () => socket.off("language-change", handleLanguageChange);
  }, [socket, roomId, setCode, setSelectedLanguage]);

  // Send current code + language to newly joined user
  useEffect(() => {
    const handleRequestCode = ({ targetSocketId }) => {
      socket.emit("send-code", {
        targetSocketId,
        code,
        language: selectedLanguage,
      });
    };

    socket.on("request-code", handleRequestCode);
    return () => socket.off("request-code", handleRequestCode);
  }, [socket, roomId, code, selectedLanguage]);

  // Receive initial code + language
  useEffect(() => {
    const handleReceiveCode = ({
      roomId: incomingRoom,
      code: incomingCode,
      language,
    }) => {
      if (incomingRoom !== roomId) return;

      if (language) setSelectedLanguage(language);
      setCode((prev) => (prev !== incomingCode ? incomingCode : prev));
    };

    socket.on("receive-code", handleReceiveCode);
    return () => socket.off("receive-code", handleReceiveCode);
  }, [socket, roomId, setCode, setSelectedLanguage]);
};

export default useCodeSync;