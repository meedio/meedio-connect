import cx from 'classnames';
import { Participant, TrackPublication } from 'livekit-client';
import { RefObject, useEffect } from 'react';

export interface VideoFeedProps {
  publication?: TrackPublication;
  participant: Participant;
  objFit?: 'contain' | 'cover';
  id: string;
  videoRef: RefObject<HTMLVideoElement>;
  className?: string;
}

const VideoFeed = ({ publication, objFit, videoRef, className }: VideoFeedProps) => {
  const videoTrack = publication?.videoTrack;

  useEffect(() => {
    if (videoRef.current && videoTrack) videoTrack.attach(videoRef.current);

    const cleanupRef = videoRef.current;

    return () => {
      if (cleanupRef && videoTrack) videoTrack.detach(cleanupRef);
    };
  }, [videoTrack, videoRef]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{ objectFit: objFit }}
      className={cx('h-full w-full touch-none', className)}
    />
  );
};

export default VideoFeed;
