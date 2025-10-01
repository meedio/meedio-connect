import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@shared/components/Button/Button';
import InputGroup from '@shared/components/InputGroup/InputGroup';
import { meetingTestingConstants } from '@shared/constants';
import { createClient, DELEGATED_OIDC_COMPATIBILITY } from 'matrix-js-sdk/src';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useToggle } from 'rooks';

import { SetValue } from 'hooks/useCookies';
import { formatUrl, getHomeserverBaseUrl } from 'modules/Matrix/utils';
import { Schemas } from 'utils/yup/schemas/validationSchemas';

type MatrixHomeserverForm = {
  homeserver: string;
};

type SelectHomeserverProps = {
  setCustomMatrixUrl: SetValue<string | null>;
};

/**
 * Select Homeserver component
 *
 * @param setCustomMatrixUrl - For setting the custom matrix url
 * @returns The component for selecting the homeserver
 */
const SelectHomeserver = ({ setCustomMatrixUrl }: SelectHomeserverProps) => {
  const formattedMatrixHomeserver = formatUrl(import.meta.env.REACT_APP_MATRIX_URL, true);
  const [isVisible, toggleIsVisible] = useToggle();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [displayHomeserver, setDisplayHomeserver] = useState<string>(formattedMatrixHomeserver);
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<MatrixHomeserverForm>({
    mode: 'all',
    resolver: yupResolver(Schemas.getMatrixHomeserver()),
    defaultValues: { homeserver: displayHomeserver },
  });

  const onSubmit = handleSubmit(async ({ homeserver }: MatrixHomeserverForm) => {
    setError('');
    setLoading(true);
    const formattedHomeserverUrl = formatUrl(homeserver, true);

    const baseUrl = await getHomeserverBaseUrl(formattedHomeserverUrl).finally(() => setLoading(false));
    if (!baseUrl) return setError(t('invalid_homeserver_url'));

    const tempClient = createClient({ baseUrl });
    const flows = await tempClient.loginFlows();
    // Stopping temp client to avoid a lot of temp clients being created
    tempClient.stopClient();
    if (!flows) return setError(t('delegated_oidc_compatibility_unsupported'));

    // Checking if the homeserver is OIDC compatible (Supports MAS)
    const oidcCompatible = flows.flows.find(
      (flow) => flow.type === 'm.login.sso' && DELEGATED_OIDC_COMPATIBILITY.findIn(flow)
    );
    if (!oidcCompatible) return setError(t('delegated_oidc_compatibility_unsupported'));

    setCustomMatrixUrl(formattedHomeserverUrl);
    setDisplayHomeserver(formattedHomeserverUrl);
    toggleIsVisible();
  });

  const onChangeButtonClick = () => {
    !isVisible && setError('');
    toggleIsVisible();
  };

  return (
    <div className="relative mt-2 lg:mb-[110px] md:w-full">
      <div className="flex items-center mb-2 sm:text-sm">
        <p className="font-normal text-base whitespace-nowrap">{t('homeserver')}:</p>
        <p
          className="mx-1 text-ellipsis whitespace-nowrap overflow-hidden"
          data-testid={meetingTestingConstants.matrixHomeserverDisplay}
        >
          {displayHomeserver}
        </p>
        <Button
          data-testid={meetingTestingConstants.changeMatrixHomeserverButton}
          className="font-medium"
          size="sm"
          variant="text"
          onClick={onChangeButtonClick}
        >
          {t('change')}
        </Button>
      </div>
      {isVisible && (
        <form className="lg:absolute w-[100%]" onSubmit={onSubmit}>
          <InputGroup errorMessage={error} className="flex mt-1">
            <Controller
              name="homeserver"
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputGroup.Input
                  value={value}
                  onChange={onChange}
                  data-testid={meetingTestingConstants.matrixHomeserverInput}
                  name="homeserver"
                  autoCapitalize="none"
                  className="border-gray-50"
                  placeholder={t('homeserver')}
                />
              )}
            />
            <Button
              variant="primary"
              type="submit"
              className="ml-2"
              loading={loading}
              disabled={!isValid}
              data-testid={meetingTestingConstants.setHomeserverButton}
            >
              {t('set')}
            </Button>
          </InputGroup>
        </form>
      )}
    </div>
  );
};

export default SelectHomeserver;
