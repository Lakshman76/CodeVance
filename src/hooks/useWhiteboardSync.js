import { useCallback, useEffect, useRef } from "react";
import { CaptureUpdateAction, hashElementsVersion, reconcileElements } from "@excalidraw/excalidraw";
import colorForSocket from "../utils/userColor";

const withoutImages = (elements = []) => elements.filter((element) => element.type !== "image");

const useWhiteboardSync = ({ socket, roomId, username, excalidrawAPI }) => {
  const apiRef = useRef(excalidrawAPI);
  const lastBroadcastVersion = useRef(null);
  const pendingPayload = useRef(null);
  const pendingRequests = useRef([]);
  const cursorMap = useRef(new Map());
  const emitTimer = useRef(null);
  const cursorTimer = useRef(null);
  const pendingElements = useRef(null);

  useEffect(() => { apiRef.current = excalidrawAPI; }, [excalidrawAPI]);

  const applyPayload = useCallback((payload) => {
    const api = apiRef.current;
    if (!api || !payload) return false;
    const local = withoutImages(api.getSceneElementsIncludingDeleted());
    const remote = withoutImages(payload.elements ?? []);
    const reconciled = reconcileElements(local, remote, api.getAppState());
    lastBroadcastVersion.current = hashElementsVersion(withoutImages(reconciled));
    api.updateScene({ elements: reconciled, captureUpdate: CaptureUpdateAction.NEVER });
    return true;
  }, []);

  useEffect(() => {
    if (!excalidrawAPI || !pendingPayload.current) return;
    applyPayload(pendingPayload.current);
    pendingPayload.current = null;
  }, [excalidrawAPI, applyPayload]);

  useEffect(() => {
    if (!excalidrawAPI || !pendingRequests.current.length) return;
    const api = apiRef.current;
    const requests = pendingRequests.current.splice(0);
    const elements = withoutImages(api.getSceneElementsIncludingDeleted());
    requests.forEach((targetSocketId) => socket.emit("send-whiteboard", { targetSocketId, roomId, elements }));
  }, [excalidrawAPI, socket, roomId]);

  useEffect(() => {
    cursorMap.current.clear();
    apiRef.current?.updateScene({ collaborators: new Map() });
    lastBroadcastVersion.current = null;
    pendingPayload.current = null;
    pendingRequests.current = [];
    const scoped = (payload) => payload?.roomId === roomId;

    const receiveScene = (payload) => {
      if (!scoped(payload)) return;
      if (!applyPayload(payload)) pendingPayload.current = payload;
    };
    const requestScene = ({ targetSocketId } = {}) => {
      const api = apiRef.current;
      if (!api) {
        pendingRequests.current.push(targetSocketId);
        return;
      }
      socket.emit("send-whiteboard", {
        targetSocketId,
        roomId,
        elements: withoutImages(api.getSceneElementsIncludingDeleted()),
      });
    };
    const receiveCursor = ({ roomId: incomingRoom, socketId, username: peerName, pointer, button }) => {
      if (incomingRoom !== roomId || !socketId || socketId === socket.id) return;
      cursorMap.current.set(socketId, {
        pointer, button, username: peerName || "Collaborator", color: colorForSocket(socketId),
      });
      apiRef.current?.updateScene({ collaborators: new Map(cursorMap.current) });
    };
    const receiveParticipants = (participants = []) => {
      const ids = new Set(participants.map((peer) => typeof peer === "string" ? peer : peer.socketId ?? peer.id).filter(Boolean));
      for (const id of cursorMap.current.keys()) if (!ids.has(id)) cursorMap.current.delete(id);
      apiRef.current?.updateScene({ collaborators: new Map(cursorMap.current) });
    };

    socket.on("whiteboard-change", receiveScene);
    socket.on("receive-whiteboard", receiveScene);
    socket.on("request-whiteboard", requestScene);
    socket.on("whiteboard-cursor", receiveCursor);
    socket.on("participants", receiveParticipants);
    socket.emit("request-whiteboard", { roomId });
    return () => {
      socket.off("whiteboard-change", receiveScene);
      socket.off("receive-whiteboard", receiveScene);
      socket.off("request-whiteboard", requestScene);
      socket.off("whiteboard-cursor", receiveCursor);
      socket.off("participants", receiveParticipants);
      cursorMap.current.clear();
      pendingRequests.current = [];
      if (emitTimer.current) clearTimeout(emitTimer.current);
      if (cursorTimer.current) clearTimeout(cursorTimer.current);
    };
  }, [socket, roomId, applyPayload]);

  const onChange = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    const elements = withoutImages(api.getSceneElementsIncludingDeleted());
    const version = hashElementsVersion(elements);
    if (version === lastBroadcastVersion.current) return;
    pendingElements.current = elements;
    if (emitTimer.current) return;
    emitTimer.current = setTimeout(() => {
      emitTimer.current = null;
      const latest = pendingElements.current;
      if (!latest) return;
      const latestVersion = hashElementsVersion(latest);
      if (latestVersion === lastBroadcastVersion.current) return;
      socket.emit("whiteboard-change", { roomId, elements: latest });
      lastBroadcastVersion.current = latestVersion;
    }, 100);
  }, [socket, roomId]);

  const onPointerUpdate = useCallback(({ pointer, button }) => {
    if (cursorTimer.current) return;
    cursorTimer.current = setTimeout(() => {
      cursorTimer.current = null;
    }, 40);
    socket.emit("whiteboard-cursor", { roomId, username, pointer, button });
  }, [socket, roomId, username]);

  return { onChange, onPointerUpdate };
};

export default useWhiteboardSync;
