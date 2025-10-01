import { CreateLocalTracksOptions, createLocalTracks } from 'livekit-client';

interface AskForPermissionsProps {
  options: CreateLocalTracksOptions;
  onSuccess: () => void;
}

export const getHasDefaultDevice = async () => {
  const audioDevices = (await navigator.mediaDevices.enumerateDevices()).filter(({ kind }) => kind === 'audioinput');
  const hasDefaultAudioDevice = audioDevices.some(({ deviceId }) => deviceId === 'default');

  return hasDefaultAudioDevice;
};

export const askForPermissions = ({ options, onSuccess }: AskForPermissionsProps) =>
  createLocalTracks(options)
    .then((tracks) => {
      tracks.forEach(async (track) => {
        track.mediaStreamTrack.stop();
      });
      onSuccess();
    })
    .catch(() => {
      //NOTE: empty catch, we handle failed cases separately for each track
    });
