import { useTranslation } from 'react-i18next';

const TabOutdated = () => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="text-grayscale-black font-semibold text-center">{t('tab_released')}</h2>
      <span className="text-center font-light md:text-lg text-grayscale-gray80">{t('close_this_window_now')}</span>
    </>
  );
};

export default TabOutdated;
