import { JoinErrorEnum } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import i18n from 'i18n/config';

export const KNOCK_ERROR_MESSAGE = "You don't have permission to knock";
export const BAN_ERROR_MESSAGE = 'banned';
export const NOT_INVITED_ERROR_MESSAGE = 'You are not invited to this room';

export const getJoinErrorTranslation = (errorType: JoinErrorEnum) => {
  if (errorType === JoinErrorEnum.NOT_INVITED) return i18n.t('not_invited_to_room');
  if (errorType === JoinErrorEnum.BANNED) return i18n.t('participant_banned');

  return i18n.t('errors.something_went_wrong');
};
