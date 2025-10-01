import Switch, { SwitchProps } from '@shared/components/Switch/Switch';
import Tooltip from '@shared/components/Tooltip/Tooltip';
import { useTranslation } from 'react-i18next';

const SwitchWithDisabledFeatureTooltip = (props: SwitchProps) => {
  const { t } = useTranslation();

  if (props.disabled) {
    return (
      <Tooltip label={t('only_one_feature_active')} inPortal>
        <Switch {...props} />
      </Tooltip>
    );
  }

  return <Switch {...props} />;
};

export default SwitchWithDisabledFeatureTooltip;
