import Header from '@shared/components/Header/Header';
import cx from 'classnames';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import HeaderLogo from 'components/HeaderLogo/HeaderLogo';
import LanguageSelect from 'components/LanguageSelect/LanguageSelect';

import Profile from './Authentication/Profile';
import HelpDropdown from './HelpDropdown/HelpDropdown';

interface Props {
  hasRightImage?: boolean;
  children: ReactNode;
}

const PageWrapper = ({ hasRightImage, children }: Props) => {
  const { pathname } = useLocation();
  const inAuthPage = pathname === '/auth';

  return (
    <div
      className={cx(
        'top-area-padding side-area-padding flex h-full w-full flex-col overflow-y-auto',
        {
          'overflow-x-hidden': hasRightImage,
        }
      )}
    >
      <Header variant='light'>
        <HeaderLogo variant='primary' />
        <Header.Right>
          <LanguageSelect />
          {inAuthPage ? <HelpDropdown /> : <Profile />}
        </Header.Right>
      </Header>
      {children}
    </div>
  );
};

export default PageWrapper;
