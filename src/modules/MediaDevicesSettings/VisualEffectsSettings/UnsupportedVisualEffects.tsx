import { ReactComponent as AlertCircle } from '@shared/components/assets/icons/AlertCircle.svg';
import { Trans, useTranslation } from 'react-i18next';

import { externalLinks } from 'utils/Constants';

const UnsupportedVisualEffects = () => {
  const { t } = useTranslation();

  const linkToBrowser = (
    <a href={externalLinks.CHROME} target="_blank" rel="noreferrer" className="text-primary-50 underline" />
  );

  return (
    <div className="flex flex-col items-center text-center py-6 px-4">
      <AlertCircle className="stroke-1.5 stroke-grayscale-black h-6 w-6 mb-4" />
      <p className="text-size-md font-medium">{t('blur.unsupported_browser')}</p>
      <p className="mt-1">
        <Trans
          i18nKey="blur.unsupported_browser_explanation"
          components={{
            browser: linkToBrowser,
          }}
        />
      </p>
    </div>
  );
};

export default UnsupportedVisualEffects;
