import Button, { ButtonProps } from '@shared/components/Button/Button';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Video } from 'assets/icons/Video.svg';
import Spinner from 'components/Spinner/Spinner';
import useTheme from 'hooks/useTheme';
import { isBrowserSupported } from 'utils/browsers';
import testingConstants from 'utils/testingConstants';

type RoomJoinButtonProps = Pick<ButtonProps, 'disabled' | 'children' | 'loading'> & {
  onClick: () => void;
  isAcquiringTracks?: boolean;
};

const RoomJoinButton = ({
  onClick,
  disabled,
  loading,
  isAcquiringTracks = false,
  children,
}: PropsWithChildren<RoomJoinButtonProps>) => {
  const { t } = useTranslation();
  const { joinButtonVariant } = useTheme();

  const renderButtonContent = () => {
    if (isAcquiringTracks) return <Spinner variant="disabledPrimary" />;
    if (!isBrowserSupported) return t('unsupported_browser_btn');

    return (
      <div className="flex flex-row space-x-3">
        <span className="text-size-md font-medium">{children}</span>
        <Video className="h-6 w-6 stroke-current stroke-2" />
      </div>
    );
  };

  return (
    <Button
      onClick={onClick}
      className="w-full"
      variant={joinButtonVariant}
      loading={loading}
      loadingText={t('loading')}
      disabled={disabled || !isBrowserSupported}
      data-testid={testingConstants.joinBtn}
    >
      {renderButtonContent()}
    </Button>
  );
};

export default RoomJoinButton;
