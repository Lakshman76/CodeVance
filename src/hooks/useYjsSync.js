import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate, removeAwarenessStates } from "y-protocols/awareness";
import colorForSocket from "../utils/userColor";

const DEFAULT_CODE = 'console.log("Hello World");';
const useYjsSync = ({ socket, roomId, username }) => {
  const doc = useMemo(() => new Y.Doc(), [roomId]);
  const ytext = useMemo(() => doc.getText("code"), [doc]);
  const meta = useMemo(() => doc.getMap("meta"), [doc]);
  const awareness = useMemo(() => new Awareness(doc), [doc]);
  const [language, setLanguageState] = useState(meta.get("language") || "JavaScript");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLanguageState(meta.get("language") || "JavaScript");
    setReady(false);
    const color = colorForSocket(socket.id);
    awareness.setLocalStateField("user", { name: username || "Collaborator", color: color.color, colorLight: color.colorLight });
    awareness.setLocalStateField("socketId", socket.id);

    let receivedSync = false;
    const handleDocUpdate = (update, origin) => {
      if (origin !== "remote") socket.emit("yjs-update", { update });
    };
    const handleAwarenessUpdate = ({ added, updated, removed }, origin) => {
      if (origin !== "remote") {
        const changed = [...added, ...updated, ...removed];
        if (changed.length) socket.emit("yjs-awareness", { update: encodeAwarenessUpdate(awareness, changed) });
      }
    };
    const handleUpdate = ({ roomId: incomingRoom, update } = {}) => {
      if (incomingRoom !== roomId || !(update instanceof Uint8Array)) return;
      Y.applyUpdate(doc, update, "remote");
      receivedSync = true;
      setReady(true);
    };
    const handleAwareness = ({ roomId: incomingRoom, update } = {}) => {
      if (incomingRoom !== roomId || !(update instanceof Uint8Array)) return;
      applyAwarenessUpdate(awareness, update, "remote");
    };
    const handleRequestSync = ({ targetSocketId } = {}) => {
      if (!targetSocketId) return;
      socket.emit("yjs-send-sync", { targetSocketId, update: Y.encodeStateAsUpdate(doc) });
      socket.emit("yjs-awareness", { update: encodeAwarenessUpdate(awareness, [awareness.clientID]) });
    };
    const handleParticipants = (participants = []) => {
      const ids = new Set(participants.map((peer) => typeof peer === "string" ? peer : peer.socketId ?? peer.id).filter(Boolean));
      const stale = [];
      awareness.getStates().forEach((state, clientID) => {
        if (clientID !== awareness.clientID && state.socketId && !ids.has(state.socketId)) stale.push(clientID);
      });
      if (stale.length) removeAwarenessStates(awareness, stale, "remote");
    };

    doc.on("update", handleDocUpdate);
    awareness.on("update", handleAwarenessUpdate);
    socket.on("yjs-update", handleUpdate);
    socket.on("yjs-receive-sync", handleUpdate);
    socket.on("yjs-awareness", handleAwareness);
    socket.on("yjs-request-sync", handleRequestSync);
    socket.on("participants", handleParticipants);

    const seedTimer = setTimeout(() => {
      if (!receivedSync) {
        const seedDoc = new Y.Doc();
        seedDoc.clientID = 1;
        seedDoc.getText("code").insert(0, DEFAULT_CODE);
        seedDoc.getMap("meta").set("language", "JavaScript");
        Y.applyUpdate(doc, Y.encodeStateAsUpdate(seedDoc), "seed");
        seedDoc.destroy();
        setReady(true);
      }
    }, 600);
    const observeLanguage = () => setLanguageState(meta.get("language") || "JavaScript");
    meta.observe(observeLanguage);

    return () => {
      clearTimeout(seedTimer);
      doc.off("update", handleDocUpdate);
      meta.unobserve(observeLanguage);
      awareness.off("update", handleAwarenessUpdate);
      socket.off("yjs-update", handleUpdate);
      socket.off("yjs-receive-sync", handleUpdate);
      socket.off("yjs-awareness", handleAwareness);
      socket.off("yjs-request-sync", handleRequestSync);
      socket.off("participants", handleParticipants);
      removeAwarenessStates(awareness, [awareness.clientID], "local");
      awareness.destroy();
      doc.destroy();
    };
  }, [awareness, doc, meta, roomId, socket, username]);

  const setLanguage = (name, starterCode) => {
    doc.transact(() => {
      meta.set("language", name);
      ytext.delete(0, ytext.length);
      ytext.insert(0, starterCode);
    });
  };

  return { ytext, awareness, language, setLanguage, getCode: () => ytext.toString(), ready };
};

export default useYjsSync;
