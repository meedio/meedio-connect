export const getDummyVideoTrack = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 640;
  canvas.height = 480;

  const drawFrame = () => {
    if (!ctx) return;

    const getRandomColor = () => Math.floor(Math.random() * 255);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(drawFrame);
  };

  drawFrame();

  const videoTrack = canvas.captureStream(30).getTracks()[0];

  return videoTrack;
};

export const getDiagnosticsVideoElement = (mediaStream: MediaStream) => {
  const videoElement = document.createElement('video');
  videoElement.setAttribute('playsinline', 'true');
  videoElement.setAttribute('autoplay', 'true');
  videoElement.setAttribute('muted', 'true');
  videoElement.srcObject = mediaStream;

  return videoElement;
};
