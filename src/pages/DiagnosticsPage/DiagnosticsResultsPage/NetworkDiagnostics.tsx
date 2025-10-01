import Divider from '@shared/components/Divider/Divider';
import { ReactComponent as ConnectionHigh } from 'assets/icons/ConnectionHigh.svg';
import { ReactComponent as ConnectionLow } from 'assets/icons/ConnectionLow.svg';
import { ReactComponent as ConnectionMedium } from 'assets/icons/ConnectionMedium.svg';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Wifi } from 'assets/icons/Wifi.svg';
import { ReactComponent as WifiOff } from 'assets/icons/WifiOff.svg';

import DiagnosticsCategory from './DiagnosticCategory/DiagnosticCategory';

const mockProps = {
  title: 'Mock title',
  subtitle: 'Mock subtitle',
  status: '100ms',
};

const NetworkDiagnostics = () => {
  const { t } = useTranslation();

  return (
    <DiagnosticsCategory icon={Wifi} title={t('network')} subtitle="2 Critical & 1 Warning issues" variant="error">
      <DiagnosticsCategory.Item {...mockProps} variant="error" icon={WifiOff} />
      <Divider />
      <DiagnosticsCategory.Item {...mockProps} variant="error" icon={ConnectionLow} hasIconColor={false} />
      <Divider />
      <DiagnosticsCategory.Item {...mockProps} variant="warning" icon={ConnectionMedium} hasIconColor={false} />
      <Divider />
      <DiagnosticsCategory.Item {...mockProps} variant="success" icon={ConnectionHigh} hasIconColor={false} />
      <Divider />
    </DiagnosticsCategory>
  );
};

export default NetworkDiagnostics;
