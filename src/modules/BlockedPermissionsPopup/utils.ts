const MAC_OS_SECURITY_SETTINGS = 'x-apple.systempreferences:com.apple.preference.security';
const MAC_OS_CAMERA_SETTINGS = 'x-apple.systempreferences:com.apple.preference.security?Privacy_Camera';
const MAC_OS_MIC_SETTINGS = 'x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone';

const WINDOWS_PRIVACY_SETTINGS = 'ms-settings:privacy';
const WINDOWS_CAMERA_SETTINGS = 'ms-settings:privacy-webcam';
const WINDOWS_MIC_SETTINGS = 'ms-settings:privacy-microphone';

export const getLinksByOS = () => {
  if (navigator.userAgent.toLowerCase().includes('win')) {
    return { camUrl: WINDOWS_CAMERA_SETTINGS, micUrl: WINDOWS_MIC_SETTINGS, mainUrl: WINDOWS_PRIVACY_SETTINGS };
  }

  return { camUrl: MAC_OS_CAMERA_SETTINGS, micUrl: MAC_OS_MIC_SETTINGS, mainUrl: MAC_OS_SECURITY_SETTINGS };
};

export const getIsLinux = () => navigator.userAgent.toLowerCase().includes('linux');
