import { useTranslation } from 'react-i18next';

import useUpdateDisplayName from 'modules/Authentication/hooks/useUpdateDisplayName';
import SettingsCard from 'modules/SettingsModal/SettingsCard/SettingsCard';
import { Schemas } from 'utils/yup/schemas/validationSchemas';

/**
 * Change display name component
 * @returns The component for display name change, for both authenticated and unauthenticated users
 */
const ChangeDisplayName = () => {
  const { t } = useTranslation();
  const { mxDisplayName, updateDisplayName, isNameUpdateLoading } = useUpdateDisplayName();

  return (
    <SettingsCard.Content>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <SettingsCard.Content.Title>{t('display_name')}</SettingsCard.Content.Title>
          <SettingsCard.Content.Description>{t('display_name_explanation')}</SettingsCard.Content.Description>
        </div>
        <SettingsCard.Content.Form
          schema={Schemas.getUpdateDisplayName()}
          defaultValue={mxDisplayName}
          onSubmit={updateDisplayName}
          fieldName="displayName"
          loading={isNameUpdateLoading}
          placeholder={t('enter_display_name')}
          containerClassName="flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2"
          buttonClassName="!ml-0 sm:!ml-2 max-w-[302px]"
        />
      </div>
    </SettingsCard.Content>
  );
};

export default ChangeDisplayName;
