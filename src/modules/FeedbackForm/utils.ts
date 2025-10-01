import { FeedbackIssue } from 'contexts/FeedbackContext/FeedbackContext';
import i18n from 'i18n/config';
import { logAndSendToSentry } from 'utils/utils';

export const getFeedbackTranslations = () => ({
  CANT_SEE_PARTICIPANTS: i18n.t('feedback.cant_see_participants'),
  CAMERA_NO_WORK: i18n.t('feedback.camera_no_work'),
  LOW_QUALITY_VIDEO: i18n.t('feedback.low_quality_video'),
  AUDIO_NOT_WORKING: i18n.t('feedback.audio_not_working'),
  MICROPHONE_NO_WORK: i18n.t('feedback.microphone_no_work'),
  AUDIO_LOW_QUALITY: i18n.t('feedback.audio_low_quality'),
  AUDIO_STUTTER: i18n.t('feedback.audio_stutter'),
  AUDIO_ECHO: i18n.t('feedback.audio_echo'),
  PARTICIPANTS_CANNOT_JOIN: i18n.t('feedback.participants_cannot_join'),
  DEVICE_SLOWDOWN: i18n.t('feedback.device_slowdown'),
  DISCONNECTS: i18n.t('feedback.disconnects'),
  DEVICE_HOT: i18n.t('feedback.device_hot'),
  DEVICE_BATTERY_USAGE: i18n.t('feedback.device_battery_usage'),
  OTHER: i18n.t('feedback.other'),
});

export enum FeedbackIssueName {
  CANT_SEE_PARTICIPANTS = 'CANT_SEE_PARTICIPANTS',
  CAMERA_NO_WORK = 'CAMERA_NO_WORK',
  LOW_QUALITY_VIDEO = 'LOW_QUALITY_VIDEO',
  AUDIO_NOT_WORKING = 'AUDIO_NOT_WORKING',
  MICROPHONE_NO_WORK = 'MICROPHONE_NO_WORK',
  AUDIO_LOW_QUALITY = 'AUDIO_LOW_QUALITY',
  AUDIO_STUTTER = 'AUDIO_STUTTER',
  AUDIO_ECHO = 'AUDIO_ECHO',
  PARTICIPANTS_CANNOT_JOIN = 'PARTICIPANTS_CANNOT_JOIN',
  DEVICE_SLOWDOWN = 'DEVICE_SLOWDOWN',
  DISCONNECTS = 'DISCONNECTS',
  DEVICE_HOT = 'DEVICE_HOT',
  DEVICE_BATTERY_USAGE = 'DEVICE_BATTERY_USAGE',
  OTHER = 'OTHER',
}

export const processFeedbackIssues = (feedbackIssues: FeedbackIssue[]) => {
  const validIssueNames = Object.keys(FeedbackIssueName);
  const filteredIssues = feedbackIssues.filter(({ name }) => validIssueNames.includes(name));

  const unrecognizedIssues = feedbackIssues.filter(({ name }) => !validIssueNames.includes(name));
  if (unrecognizedIssues.length > 0) logAndSendToSentry('Unrecognized feedback issues found');

  const missingIssues = validIssueNames.filter((name) => !feedbackIssues.some((issue) => issue.name === name));
  if (missingIssues.length > 0) logAndSendToSentry('Missing feedback issues');

  return filteredIssues;
};
