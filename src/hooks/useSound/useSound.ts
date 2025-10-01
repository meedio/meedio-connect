import { useCallback, useEffect, useRef, useState } from 'react';

const useSound = (audioClip: string, audioOutputId: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      setIsPlaying(true);

      // NOTE: High chance that the errors was thrown when user have not been interacting with page, so we cannot do anything to ensure user interaction
      audioRef.current.play().catch(() => null);
    }
  }, []);

  const onAudioEnded = () => setIsPlaying(false);

  useEffect(() => {
    if (audioClip && !audioRef.current) {
      audioRef.current = new Audio(audioClip);
      audioRef.current.addEventListener('ended', onAudioEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', onAudioEnded);
        audioRef.current = null;
      }
    };
  }, [audioClip]);

  useEffect(() => {
    if (audioRef.current && audioRef.current.setSinkId && audioOutputId) {
      audioRef.current.setSinkId(audioOutputId);
    }
  }, [audioOutputId]);

  return { playSound, isPlaying };
};

export default useSound;
