export const getMediaDevices = (constraints: MediaStreamConstraints) =>
  navigator.mediaDevices.getUserMedia(constraints);

export const getExactConstraint = (deviceId: string) => ({ deviceId: { exact: deviceId } });
export const getPreferredConstraint = (deviceId: string) => ({ deviceId });

export const getAudioConstraints = (deviceId: string) => ({
  audio: getExactConstraint(deviceId),
});

export const getVideoConstraints = (deviceId: string) => ({
  video: getExactConstraint(deviceId),
});
