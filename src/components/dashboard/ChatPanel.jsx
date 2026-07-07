import Chat from "../chat/Chat";

const ChatPanel = ({ socket, roomId, username }) => {
  return <Chat socket={socket} roomId={roomId} username={username} />;
};
export default ChatPanel;
