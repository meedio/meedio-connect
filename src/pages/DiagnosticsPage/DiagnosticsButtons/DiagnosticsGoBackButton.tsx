import Button from '@shared/components/Button/Button';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowBack } from 'assets/icons/ArrowBack.svg';

import { DiagnosticsPageLocationState } from '../utils';

const DiagnosticsGoBackButton = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { goBackRoute } = (state as DiagnosticsPageLocationState) || {};

  if (!goBackRoute) return null;

  const goBack = () => navigate(goBackRoute);

  return (
    <Button onClick={goBack} variant="secondaryTertiary" className="md:w-fit-content w-full">
      <ArrowBack className="color-white mr-3 h-6 w-6 stroke-current stroke-1.5" />
      {t('back_to_room')}
    </Button>
  );
};

export default DiagnosticsGoBackButton;
