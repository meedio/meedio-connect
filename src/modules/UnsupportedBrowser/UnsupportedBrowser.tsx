import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Chrome } from 'assets/icons/Chrome.svg';
import { ReactComponent as MeedioLogo } from 'assets/icons/MeedioLogo.svg';
import { ReactComponent as WorldExclamation } from 'assets/icons/WorldExclamation.svg';
import GradientIconWithShadow from 'components/GradientIconWithShadow/GradientIconWithShadow';
import { externalLinks } from 'Constants';

import BrowserOption from './BrowserOption';

const iconClass = 'h-8 w-8';

const UnsupportedBrowser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigateToHome = () => navigate('/');

  return (
    <div className="flex h-full w-full overflow-y-auto p-4">
      <div className="flex flex-col items-center m-auto max-w-[768px]">
        <GradientIconWithShadow icon={WorldExclamation} className="mb-14" />
        <div className="flex flex-col space-y-2 items-center mb-8">
          <h2 className="text-grayscale-black font-semibold text-center">{t('your_browser_is_not_supported')}</h2>
          <span className="text-center font-light md:text-lg text-grayscale-gray80">
            {t('unsupported_browser_explanation')}
          </span>
        </div>
        <BrowserOption
          icon={<Chrome className={iconClass} />}
          title={t('download')}
          subtitle="Chrome"
          url={externalLinks.CHROME}
        />
        <MeedioLogo onClick={navigateToHome} className="!fill-primary-50 h-12 mt-14 cursor-pointer" />
      </div>
    </div>
  );
};

export default UnsupportedBrowser;
