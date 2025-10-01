import { create, useModal } from '@ebay/nice-modal-react';
import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import { useTranslation } from 'react-i18next';

import { ReactComponent as MicrophoneOff } from 'assets/icons/MicrophoneOff.svg';
import { ReactComponent as VideoOff } from 'assets/icons/VideoOff.svg';
import GradientIconWithShadow, {
  BackgroundVariant,
  IconVariant,
} from 'components/GradientIconWithShadow/GradientIconWithShadow';

import { getLinksByOS, getIsLinux } from './utils';

export enum BlockedDeviceEnum {
  CAMERA = 'CAMERA',
  MIC = 'MIC',
  BOTH = 'BOTH',
}

interface BlockedPermissionsPopupProps {
  onDismiss?: () => void;
  blockedDevice?: BlockedDeviceEnum;
}

const iconProps = { bgVariant: 'alert' as BackgroundVariant, iconVariant: 'white' as IconVariant };

const IS_LINUX = getIsLinux();

const BlockedPermissionsPopup = create(
  ({ onDismiss, blockedDevice = BlockedDeviceEnum.BOTH }: BlockedPermissionsPopupProps) => {
    const { t } = useTranslation();
    const { remove } = useModal(BlockedPermissionsPopup);

    const handleRequestPermissions = () => {
      const { camUrl, micUrl, mainUrl } = getLinksByOS();

      if (IS_LINUX) throw new Error('Attempt to access Linux system permissions');

      if (blockedDevice === BlockedDeviceEnum.BOTH) window.open(mainUrl, '_blank');
      else if (blockedDevice === BlockedDeviceEnum.CAMERA) window.open(camUrl, '_blank');
      else window.open(micUrl, '_blank');

      remove();
    };

    const handleDismiss = () => {
      if (onDismiss) onDismiss();

      remove();
    };

    const allDevicesBlocked = blockedDevice === BlockedDeviceEnum.BOTH;

    return (
      <Popup
        className="!m-auto box-content !h-auto !w-full !max-w-[512px] !py-0 px-4"
        isVisible
        isViewportScrollable
        wrapperId="blockedPermissionsPopup"
      >
        <Popup.Container className="!my-4 !max-w-[400px] p-4">
          <div className="mt-6 flex w-full justify-center space-x-4">
            {(blockedDevice === BlockedDeviceEnum.CAMERA || allDevicesBlocked) && (
              <GradientIconWithShadow icon={VideoOff} {...iconProps} />
            )}
            {(blockedDevice === BlockedDeviceEnum.MIC || allDevicesBlocked) && (
              <GradientIconWithShadow icon={MicrophoneOff} {...iconProps} />
            )}
          </div>
          <div className="my-8 text-center text-black">
            <p className="text-size-md mb-2 font-medium">{t('blocked_permissions.title')}</p>
            <ol className="list-decimal text-left mx-4 font-light text-size-sm text-grayscale-gray80">
              <li>{t('blocked_permissions.step_one')}</li>
              <li>{t('blocked_permissions.step_two')}</li>
              <li>{t('blocked_permissions.step_three')}</li>
            </ol>
          </div>
          <div className="flex flex-col space-y-4">
            {!IS_LINUX && (
              <Button className="w-full" variant="primary" onClick={handleRequestPermissions}>
                {t('blocked_permissions.open_system_settings')}
              </Button>
            )}
            <Button className="w-full" variant="tertiary" onClick={handleDismiss}>
              {t('dismiss')}
            </Button>
          </div>
        </Popup.Container>
      </Popup>
    );
  }
);

export default BlockedPermissionsPopup;
