import { meetingTestingConstants } from '@shared/constants';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Button from '../../lib/Button/Button';

interface NotFoundProps {
  onGoBackHome?: () => void;
}

const NotFound = ({ children, onGoBackHome }: PropsWithChildren<NotFoundProps>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const navigateToRootRoute = () => navigate('/');
  const handleRedirect = onGoBackHome || navigateToRootRoute;

  return (
    <div className="m-4 flex h-full items-center justify-center">
      <div className="flex flex-col space-y-2 md:flex-row md:space-x-10 md:space-y-0">
        <div className="text-primary-50 text-4xl md:text-6xl">404</div>
        <div>
          <h1 className="text-4xl md:text-6xl">{children || t('page_not_found')}</h1>
          <Button
            className="mt-8"
            variant="primary"
            onClick={handleRedirect}
            data-testid={meetingTestingConstants.goBackHomeButton}
          >
            {t('go_back_home')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
