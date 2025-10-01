import { Trans } from 'react-i18next';

import { ReactComponent as AlertCircle } from 'assets/icons/AlertCircle.svg';

type AliasNotAvailableProps = { alias: string };

const AliasNotAvailable = ({ alias }: AliasNotAvailableProps) => (
  <div className="flex items-center gap-1">
    <AlertCircle className="stroke-tertiary-50 w-5 h-5" />
    <span className="text-size-sm text-tertiary-50 truncate whitespace-nowrap">
      <Trans
        i18nKey="alias_not_available"
        components={{ bold: <span className="font-semibold" /> }}
        values={{ alias }}
      />
    </span>
  </div>
);

export default AliasNotAvailable;
