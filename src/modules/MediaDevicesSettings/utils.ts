// NOTE: we might need to check for 'setSinkId' in AudioContext.prototype if "webAudioMix" option is used in the livekit room
export const hasSupportSetSinkId = (() => {
  if (typeof document === 'undefined') return false;

  const audioElement = document.createElement('audio');
  const supportsSetSinkIdOnElement = 'setSinkId' in audioElement;

  return supportsSetSinkIdOnElement;
})();
