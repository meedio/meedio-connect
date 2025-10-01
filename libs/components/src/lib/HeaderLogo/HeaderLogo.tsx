import { meetingTestingConstants } from '@shared/constants';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as Logo } from '../../assets/images/Logo.svg';

const variants = {
  dark: 'text-primaryComp-50',
  primary: 'text-primary-50',
};

export type HeaderLogoVariant = keyof typeof variants;

export interface HeaderLogoProps {
  variant: HeaderLogoVariant;
  className?: string;
}

const HeaderLogo = ({ variant, className }: HeaderLogoProps) => {
  const navigate = useNavigate();

  const handleClick = () => navigate('/');

  return (
    <div className="inline-flex h-full items-center lg:flex-1">
      <Logo
        data-testid={meetingTestingConstants.meedioLogo}
        className={cx(
          'logo-mobile cursor-pointer fill-current md:h-6 md:w-32 ',
          variant && variants[variant],
          className
        )}
        onClick={handleClick}
      />
    </div>
  );
};

export default HeaderLogo;
