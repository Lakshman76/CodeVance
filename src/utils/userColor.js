const colorForSocket = (socketId = "") => {
  let hash = 5381;
  for (let i = 0; i < socketId.length; i += 1) hash = (hash * 33) ^ socketId.charCodeAt(i);
  const hue = (hash >>> 0) % 360;
  return {
    background: `hsl(${hue} 75% 42%)`,
    stroke: `hsl(${hue} 90% 72%)`,
    color: `hsl(${hue} 90% 72%)`,
    colorLight: `hsl(${hue} 75% 42% / 28%)`,
  };
};

export default colorForSocket;
export { colorForSocket };
