import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Button from '../../Button/Button';

const UnexpectedError = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
    console.log('reload on unexpected error');
    window.location.reload();
  };

  return (
    <div className="flex h-full w-full flex-col content-center items-center justify-center">
      <h3 className="text-secondary m-4 flex flex-col items-center">
        <Trans i18nKey="something_went_wrong">
          <b>Oops!</b> Something went wrong.
        </Trans>
      </h3>
      <Button variant="primary" size="md" className="mt-8" onClick={goHome}>
        {t('go_to_homepage')}
      </Button>
    </div>
  );
};

export default UnexpectedError;
