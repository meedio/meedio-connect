import { useTranslation } from 'react-i18next';

const ActivityIndicatorSubtitle = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="w-2 h-2 rounded-[3px] bg-complementary-50 m-1 shrink-0" />
      <span className="text-size-sm">{t('active_singular')}</span>
    </>
  );
};

export default ActivityIndicatorSubtitle;
