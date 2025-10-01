// import { useMediaStreamContext } from 'contexts/MediaStreamContext/MediaStreamContext';
// import { PcsRef } from 'contexts/PeerConnectionContext';
// import { usePreviewStreamManagerContext } from 'contexts/PreviewStreamManagerContext/PreviewStreamManagerContext';
// import useHandleCameraError from 'hooks/useHandleCameraError';

// import { useLocalDevicesContext } from 'contexts/LocalDevicesContext';

// import { getOptions, getToggleAudioDevice, getToggleVideoDevice } from './toggleDevices';

// const useDeviceOptions = (pcsRef: PcsRef) => {
//   const { inputs, mediaStream } = useMediaStreamContext();
//   const { stopAllStreams } = usePreviewStreamManagerContext();
//   const { videoInputId, setVideoInputId, audioInputId, setAudioInputId } = useLocalDevicesContext();
//   const handleCameraError = useHandleCameraError({ isChangingDevice: true });

//   const toggleAudioDevice = getToggleAudioDevice({ setDeviceId: setAudioInputId, pcsRef, mediaStream, stopAllStreams });
//   const toggleVideoDevice = getToggleVideoDevice({
//     setDeviceId: setVideoInputId,
//     pcsRef,
//     mediaStream,
//     handleError: handleCameraError,
//     stopAllStreams,
//   });

//   const audioOptions = getOptions(inputs.audio, toggleAudioDevice, audioInputId);
//   const videoOptions = getOptions(inputs.video, toggleVideoDevice, videoInputId);

//   return { audioOptions, videoOptions };
// };

// export default useDeviceOptions;
