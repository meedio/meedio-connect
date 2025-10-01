import cx from 'classnames';
import { RefObject, useEffect, useRef, useCallback } from 'react';

import { getIsMobile, isSafari } from 'utils/browsers';
import logger from 'utils/logging/faro';

export interface VideoProps {
  mediaStream?: MediaStream;
  videoRef?: RefObject<HTMLVideoElement>;
  className?: string;
}

const Video = ({ mediaStream, videoRef, className }: VideoProps) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const isMobile = getIsMobile();

  const videoElementRef = videoRef || internalVideoRef;

  const playVideo = useCallback(() => {
    if (videoElementRef.current) {
      videoElementRef.current.play().catch((e) => logger.error(`Abort Error in playVideo function: ${e}`));
    }
  }, [videoElementRef]);

  useEffect(() => {
    if (videoElementRef.current && mediaStream) {
      videoElementRef.current.srcObject = mediaStream;
      if (mediaStream.getVideoTracks()[0]) mediaStream.getVideoTracks()[0].enabled = true;
    }
    const oldVideoElement = videoElementRef.current;

    return () => {
      if (oldVideoElement && mediaStream) oldVideoElement.srcObject = null;
    };
  }, [mediaStream, videoElementRef]);

  //NOTE: safari on ios pauses remote video streams on blur and doesn't resume them on focus. (autoplay doesn't work in this case)
  useEffect(() => {
    if (!isMobile && !isSafari) return;

    window.addEventListener('focus', playVideo);

    return () => {
      window.removeEventListener('focus', playVideo);
    };
  }, [isMobile, playVideo]);

  return <video autoPlay ref={videoElementRef} playsInline muted className={cx('h-full w-full', className)} />;
};

export default Video;
