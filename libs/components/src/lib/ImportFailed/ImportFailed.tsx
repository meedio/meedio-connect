import { useTranslation } from 'react-i18next';

import { ReactComponent as FileImport } from '../../assets/icons/FileImport.svg';
import Button from '../Button/Button';

const ImportFailed = () => {
  const { t } = useTranslation();

  const handleReload = () => window.location.reload();

  return (
    <div className="m-4 flex h-full items-center justify-center">
      <div className="flex flex-col space-y-2 md:flex-row md:space-x-10 md:space-y-0">
        <div className="flex flex-col p-8">
          <div className="flex md:flex-col md:items-center gap-4">
            <FileImport className="hidden sm:block stroke-primary-50 stroke-2 w-10 h-10 md:w-14 md:h-14 shrink-0" />
            <h3 className="text-2xl md:text-4xl">{t('import_failed_title')}</h3>
          </div>
          <p className="text-gray-80 text-size-lg mb-8 mt-2 md:mb-16">{t('import_failed_subtitle')}</p>
          <div className="flex self-center justify-center items-center w-full">
            <Button className="grow max-w-98" variant="primary" onClick={handleReload}>
              {t('reload_page')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportFailed;
