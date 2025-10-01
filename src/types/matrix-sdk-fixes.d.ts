// Type declarations to fix Matrix SDK type issues
declare global {
  interface ArrayBufferLike {
    readonly byteLength: number;
    slice(begin: number, end?: number): ArrayBuffer;
  }
}

// Override problematic types from Matrix SDK
declare module 'matrix-js-sdk/src/rust-crypto/rust-crypto' {
  export function getShieldReason(): string;
}

declare module 'matrix-js-sdk/src/utils/decryptAESSecretStorageItem' {
  export function decryptAESSecretStorageItem(): any;
}

declare module 'matrix-js-sdk/src/utils/encryptAESSecretStorageItem' {
  export function encryptAESSecretStorageItem(): any;
}

declare module 'matrix-js-sdk/src/utils/internal/deriveKeys' {
  export function deriveKeys(): any;
}

declare module 'matrix-js-sdk/src/webrtc/callFeed' {
  export class CallFeed {
    analyser: AnalyserNode;
    frequencyBinCount: Float32Array;
  }
}
