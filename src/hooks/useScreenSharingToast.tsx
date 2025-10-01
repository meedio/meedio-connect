import { Trans, useTranslation } from 'react-i18next';

import { ReactComponent as Alert } from 'assets/icons/Alert.svg';
import { externalLinks } from 'Constants';
import useToast from 'contexts/ToastProvider/useToast';

const Preferences = (
  <a
    className="hover:text-gray-70 text-gray-60 underline"
    href={externalLinks.SYSTEM_PREFERENCES}
    target="_blank"
    rel="noreferrer"
  />
);
const isMac = navigator.userAgent.includes('Mac OS');

const useScreenSharingToast = () => {
  const { pushToast } = useToast();
  const { t } = useTranslation();

  const description = isMac ? (
    <Trans i18nKey="screenshare.screen_record_alert" components={{ preferences: Preferences }} />
  ) : (
    t('screenshare.screen_sharing_error')
  );

  return () => pushToast({ variant: 'info', icon: Alert, title: t('screenshare.cant_screen_share'), description });
};

export default useScreenSharingToast;
