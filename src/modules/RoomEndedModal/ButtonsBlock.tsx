import Button from '@shared/components/Button/Button';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import testingConstants from 'utils/testingConstants';

const JoinAgainButton = ({ children }: PropsWithChildren) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const lastIndex = pathname.lastIndexOf('/');
  const goBackRoute = pathname.substring(0, lastIndex) + search;

  const handleJoinAgainClick = () => navigate(goBackRoute);

  return (
    <Button variant="primary" onClick={handleJoinAgainClick} data-testid={testingConstants.endCallPopupCloseBtn}>
      {children}
    </Button>
  );
};

const BackToMainPageButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBackToMainPageClick = () => navigate('/');

  return (
    <Button variant="contrastTertiary" onClick={handleBackToMainPageClick}>
      {t('back_to_main_page')}
    </Button>
  );
};

const ButtonsBlock = ({ children }: PropsWithChildren) => <div className="flex flex-col space-y-4">{children}</div>;

ButtonsBlock.JoinAgainButton = JoinAgainButton;
ButtonsBlock.BackToMainPageButton = BackToMainPageButton;

export default ButtonsBlock;
