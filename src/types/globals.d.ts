import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import 'matrix-js-sdk/src/@types/global';
import { LivekitFocus } from 'matrix-js-sdk/src/matrixrtc/LivekitFocus';

interface CustomEventMap {
  focusChanged: CustomEvent<LivekitFocus>;
}

type SetSinkIdType = (id: string) => Promise<undefined>;
type EncodedStreams = () => { readable: ReadableStream; writable: WritableStream };

declare global {
  // eslint-disable-next-line no-var
  var __js_sdk_entrypoint: boolean;

  interface Global {
    __js_sdk_entrypoint: unknown;
  }
  namespace Vi {
    interface Assertion<T = unknown> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }

  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  }

  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface HTMLAudioElement {
    setSinkId?: SetSinkIdType;
  }

  interface RTCRtpSender {
    createEncodedStreams?: EncodedStreams;
    [key: string]: boolean;
  }

  interface RTCRtpReceiver {
    createEncodedStreams?: EncodedStreams;
    [key: string]: boolean;
  }

  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
