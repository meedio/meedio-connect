import { useTranslation } from 'react-i18next';

const SidebarPlaceholder = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-full overflow-y-auto p-1">
      <div className="max-w-120 m-auto w-full">
        <h5 className="text-center text-size-xs text-gray-100 dark:text-white">{t('room')}</h5>
      </div>
    </div>
  );
};

export default SidebarPlaceholder;
