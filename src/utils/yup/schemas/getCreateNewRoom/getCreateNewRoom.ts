import * as yup from 'yup';

import constants from 'Constants';

import { getAliasValidation } from '../validationSchemas';

export const MAX_MINUTES = 59;
export const MAX_HOURS = 23;
export const MAX_DAYS = 120;

export const getCreateNewRoomSchema = () =>
  yup.object().shape({
    roomName: yup.string().required().min(3).max(50).trim(),
    roomAlias: getAliasValidation(),
    isWaitingListEnabled: yup.boolean().required(),
    description: yup.string().max(constants.MAX_TOPIC_LENGTH).optional().trim(),
  });

export const getCreateNewRoom = () => getCreateNewRoomSchema();
