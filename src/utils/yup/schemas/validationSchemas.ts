import { TFunction } from 'i18next';
import * as yup from 'yup';

import constants from 'Constants';
import i18n from 'i18n/config';

import './schemaExtensions';
import { getCreateNewRoom } from './getCreateNewRoom/getCreateNewRoom';

export const FEEDBACK_MAX_CHARS = 2048;
const MAX_DISPLAY_NAME_CHARS = 255;

export const getAliasValidation = () =>
  yup
    .string()
    .required()
    .min(3)
    .max(50)
    .matches(/^[a-z0-9-]+$/i)
    .trim();

const getCreateRoom = () =>
  yup.object().shape({
    roomTitle: yup.string().required().min(3).max(50).trim(),
    isWaitingListEnabled: yup.boolean().required(),
    roomAlias: getAliasValidation(),
    startDate: yup.date().nullable().optional(),
    startTime: yup.date().nullable().optional(),
    description: yup.string().max(constants.MAX_TOPIC_LENGTH).optional().trim(),
  });

const getJoinRoom = () =>
  yup.object().shape({
    name: yup.string().required().max(MAX_DISPLAY_NAME_CHARS).trim(),
    acceptedToS: yup.boolean().required().isTrue(),
  });

const getJoinMatrixRoom = (t: TFunction) =>
  yup.object().shape({
    roomId: yup
      .string()
      .matches(/^![A-Za-z0-9_-]+:[A-Za-z0-9.-]+$/, t('invalid_room_id'))
      .required(),
  });

const getMatrixHomeserver = () =>
  yup.object().shape({
    homeserver: yup.string().required().max(100),
  });

const getFeedbackValidation = () =>
  yup.object().shape({
    feedbackComment: yup.string().required().max(FEEDBACK_MAX_CHARS, i18n.t('feedback.too_long')),
  });

const getUpdateDisplayName = () =>
  yup.object().shape({
    displayName: yup
      .string()
      .required(i18n.t('display_name_required'))
      .max(MAX_DISPLAY_NAME_CHARS, i18n.t('display_name_too_long', { maxLength: MAX_DISPLAY_NAME_CHARS }))
      .trim(),
  });

export const Schemas = {
  getCreateRoom,
  getJoinRoom,
  getJoinMatrixRoom,
  getMatrixHomeserver,
  getFeedbackValidation,
  getUpdateDisplayName,
  getCreateNewRoom,
};
