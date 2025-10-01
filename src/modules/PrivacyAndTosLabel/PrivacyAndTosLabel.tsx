import cx from 'classnames';
import { useState, MouseEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const variants = {
  dark: 'text-gray-100',
  light: 'text-white',
};

const hoverClass = 'hover:underline';

const linkVariant = {
  dark: `text-primary-50 ${hoverClass}`,
  light: `text-primary-50 ${hoverClass}`,
};

type Variant = keyof typeof variants;

interface PrivacyAndTosLinksProps {
  htmlFor?: string;
  variant?: Variant;
  className?: string;
  isGuest?: boolean;
}

const PrivacyAndTosLabel = ({ htmlFor, variant = 'dark', className, isGuest = false }: PrivacyAndTosLinksProps) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const { t } = useTranslation();

  const linkClass = cx('capitalize cursor-pointer underline', linkVariant[variant]);

  const linkProps = {
    target: '_blank',
    rel: 'noreferrer',
    className: linkClass,
  };

  const terms = (
    <a href={t('terms_of_service_link')} {...linkProps}>
      Terms of Service
    </a>
  );

  const privacy = (
    <a href={t('privacy_policy_link')} {...linkProps}>
      Privacy Policy
    </a>
  );

  const handleExpandText = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsTextExpanded(true);
  };

  const expand = (
    <span className={linkClass} onClick={handleExpandText}>
      Full Text
    </span>
  );

  const email = (
    <a className={cx('cursor-pointer', linkVariant[variant])} href="mailto:we@meedio.me">
      we@meedio.me
    </a>
  );

  return (
    <label htmlFor={htmlFor}>
      <p className={cx('text-size-sm', variants[variant], className)}>
        {isGuest ? (
          isTextExpanded ? (
            <Trans i18nKey="terms_checkbox_guest_full" components={{ privacy, email }} />
          ) : (
            <Trans i18nKey="terms_checkbox_guest" components={{ privacy, expand }} />
          )
        ) : (
          <Trans i18nKey="terms_checkbox" components={{ terms, privacy }} />
        )}
      </p>
    </label>
  );
};

export default PrivacyAndTosLabel;
