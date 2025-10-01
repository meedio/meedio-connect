import { yupResolver } from '@hookform/resolvers/yup';
import Checkbox from '@shared/components/Checkbox/Checkbox';
import ErrorMessage from '@shared/components/ErrorMessage/ErrorMessage';
import Input from '@shared/components/InputGroup/Input';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import RoomJoinButton from 'components/RoomJoinButton/RoomJoinButton';
import { ConnectionStatus, JoinErrorEnum } from 'contexts/SfuConnectionStateProvider/SfuConnectionStateProvider';
import useSfuConnectionStateContext from 'contexts/SfuConnectionStateProvider/useSfuConnectionStateContext';
import useSetMatrixDisplayName from 'hooks/useSetMatrixDisplayName';
import useTheme from 'hooks/useTheme';
import useMxCookies from 'modules/Authentication/hooks/useMxCookies';
import PrivacyAndTosLabel from 'modules/PrivacyAndTosLabel/PrivacyAndTosLabel';
import { isBrowserSupported } from 'utils/browsers';
import testingConstants from 'utils/testingConstants';
import { Schemas } from 'utils/yup/schemas/validationSchemas';

import { useDuplicateJoinCheck } from './useDuplicateJoinCheck';
import usePreRoomFormJoin from './usePreRoomFormJoin';
import { getJoinErrorTranslation } from './utils';

export interface JoinForm {
  name: string;
  acceptedToS: boolean;
}

interface GuestPreRoomFormProps {
  error?: string;
  hasTracks: boolean;
  hasToKnock: boolean;
}

const GuestPreRoomForm = ({ error, hasTracks, hasToKnock }: GuestPreRoomFormProps) => {
  const { t } = useTranslation();
  const { isLightTheme, checkboxVariant } = useTheme();
  const { mxDisplayName, mxLoggedIn } = useMxCookies();
  const { connectionStatus, shouldJoinMeetingOnRoom, joinError } = useSfuConnectionStateContext();
  const { joinRoom, knockRoom } = usePreRoomFormJoin();
  const setParticipantDisplayName = useSetMatrixDisplayName();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: {
      isValid,
      errors: { acceptedToS, name: nameError },
    },
  } = useForm<JoinForm>({
    mode: 'all',
    resolver: yupResolver(Schemas.getJoinRoom()),
    defaultValues: { name: mxDisplayName || '', acceptedToS: false },
  });

  const isConnecting = connectionStatus === ConnectionStatus.CONNECTING;
  const isButtonLoading = isConnecting || isLoading || shouldJoinMeetingOnRoom;
  const isForbiddenToJoin = [JoinErrorEnum.BANNED, JoinErrorEnum.NOT_INVITED].includes(joinError as JoinErrorEnum);
  const isFormButtonDisabled = !isValid || !isBrowserSupported || !hasTracks || isForbiddenToJoin;
  const tosError = acceptedToS?.message;
  const translatedJoinError = joinError && getJoinErrorTranslation(joinError);

  const [buttonText, handleClick] = hasToKnock ? [t('ask_to_join'), knockRoom] : [t('join'), joinRoom];
  const handleClickWithLoading = async (data?: JoinForm) => {
    setIsLoading(true);
    const isNameChanged = data?.name && data.name !== mxDisplayName;
    if (isNameChanged && !mxLoggedIn) await setParticipantDisplayName(data.name);

    handleClick().finally(() => setIsLoading(false));
  };

  const handleJoin = useDuplicateJoinCheck({ handleClickWithLoading, handleSubmit });

  return (
    <div className="space-y-6">
      {!mxLoggedIn && (
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChange={onChange}
              placeholder={t('enter_your_name')}
              data-cy="guest-name"
              variant={isLightTheme ? 'regular' : 'contrast'}
              data-testid={testingConstants.joinEnterName}
            />
          )}
        />
      )}
      <ErrorMessage message={nameError?.message} />
      <RoomJoinButton
        loading={isButtonLoading}
        onClick={handleJoin}
        disabled={isFormButtonDisabled}
        isAcquiringTracks={!hasTracks}
      >
        {buttonText}
      </RoomJoinButton>
      <ErrorMessage message={error || translatedJoinError} className="my-2" />
      <div className="flex flex-col justify-start text-ellipsis">
        <Controller
          name="acceptedToS"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              checked={value}
              onChange={onChange}
              variant={checkboxVariant}
              hasError={!!tosError}
              id="acceptedToS"
              data-testid={testingConstants.tosCheckbox}
            >
              <PrivacyAndTosLabel
                htmlFor="acceptedToS"
                className="text-ellipsis whitespace-pre-line"
                variant={isLightTheme ? 'dark' : 'light'}
                isGuest
              />
            </Checkbox>
          )}
        />
        <ErrorMessage message={tosError} />
      </div>
    </div>
  );
};

export default GuestPreRoomForm;
