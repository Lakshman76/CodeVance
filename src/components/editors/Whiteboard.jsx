import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

const Whiteboard = ({ setExcalidrawAPI, onChange, onPointerUpdate }) => {
  const blockImagePaste = (data) => {
    const files = Object.values(data?.files ?? {});
    const hasImage = files.some((file) => file.mimeType?.startsWith("image/")) ||
      data?.elements?.some((element) => element.type === "image") ||
      data?.mixedContent?.some((item) => item.type === "imageUrl");
    return hasImage || files.length > 0 ? false : true;
  };

  return (
    <div
      className="h-full w-full overflow-hidden rounded-xl bg-[#10131b]"
      onDrop={(event) => event.preventDefault()}
      onDragOver={(event) => event.preventDefault()}
    >
      <Excalidraw
        theme="dark"
        excalidrawAPI={setExcalidrawAPI}
        onChange={onChange}
        onPointerUpdate={onPointerUpdate}
        onPaste={blockImagePaste}
        UIOptions={{ tools: { image: false } }}
      />
    </div>
  );
};

export default Whiteboard;
