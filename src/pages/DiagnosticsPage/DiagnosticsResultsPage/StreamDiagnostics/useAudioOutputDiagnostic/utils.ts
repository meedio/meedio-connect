export const getDiagnosticAudioTrack = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const mediaStreamDestination = audioContext.createMediaStreamDestination();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(mediaStreamDestination);
  oscillator.start();

  const [track] = mediaStreamDestination.stream.getAudioTracks();

  return track;
};

export const getDiagnosticsAudioElement = () => {
  const audioElement = document.createElement('audio');
  audioElement.setAttribute('autoplay', 'true');

  return audioElement;
};
