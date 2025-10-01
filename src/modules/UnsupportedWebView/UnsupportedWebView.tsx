import RoundedContainer from '@shared/components/RoundedContainer/RoundedContainer';
import cx from 'classnames';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ArrowLeft } from 'assets/icons/ArrowLeft.svg';
import { ReactComponent as Copy } from 'assets/icons/Copy.svg';
import { ReactComponent as DotsVertical } from 'assets/icons/DotsVertical.svg';
import { ReactComponent as ExternalLink } from 'assets/icons/ExternalLink.svg';
import { ReactComponent as MeedioLogo } from 'assets/icons/MeedioLogo.svg';
import { ReactComponent as Share } from 'assets/icons/Share.svg';
import { IconType } from 'utils/types';

type EmptyGrayBgProps = {
  className?: string;
};

const Header = () => {
  const Logo = MeedioLogo;

  return (
    <div className="border-gray-5 mb-4 flex w-full justify-center border-b pb-4">
      <Logo className="logo-size fill-secondary-50" />
    </div>
  );
};

const FakeInput = () => (
  <RoundedContainer
    className="flex !w-full items-center justify-between !shadow-none"
    variant="gray-0"
    radiusVariant="rounded"
  >
    <div className="flex">
      <ArrowLeft className="text-gray-60 stroke-1.5 h-5 w-5 stroke-current" />
      <span className="text-gray-60 text-size-sm ml-2 select-none font-medium">Meedio</span>
    </div>
    <div className="bg-gray-5 flex h-6 w-6 items-center justify-center rounded-full">
      <DotsVertical className="text-gray-60 fill-current stroke-current" />
    </div>
  </RoundedContainer>
);

const RoundedIcon = ({ icon: Icon }: { icon: IconType }) => (
  <div className="bg-gray-20 flex items-center justify-center rounded p-1">
    <Icon className="text-gray-60 stroke-1.25 h-4 w-4 stroke-current" />
  </div>
);

const Container = ({ children }: PropsWithChildren) => (
  <div className="flex w-full items-center space-x-2">{children}</div>
);

const EmptyGrayBg = ({ className }: EmptyGrayBgProps) => (
  <div className={cx('bg-gray-20 h-4 w-full rounded', className)} />
);

const OpenBrowserExplanation = () => {
  const { t } = useTranslation();

  return (
    <RoundedContainer
      className="max-w-200 flex !w-full max-w-[200px] flex-col items-center justify-between space-y-4 self-end p-4"
      variant="white"
      radiusVariant="lg"
    >
      <Container>
        <RoundedIcon icon={Share} />
        <EmptyGrayBg />
      </Container>
      <Container>
        <RoundedIcon icon={Copy} />
        <EmptyGrayBg className="max-w-47%" />
      </Container>
      <Container>
        <RoundedIcon icon={ExternalLink} />
        <div className="relative flex w-fit flex-row">
          <span className="text-gray-80 text-size-xs z-20 select-none">{t('open_in_browser')}</span>
          <div className="bg-primary-20 absolute right-0 flex h-10 w-10 -translate-y-1/4  transform items-center justify-center rounded-full opacity-40">
            <div className="bg-primary-50 z-10 h-8 w-8 rounded-full" />
          </div>
        </div>
      </Container>
    </RoundedContainer>
  );
};

const UnsupportedWebView = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-0 flex h-screen w-screen  overflow-x-hidden p-4">
      <RoundedContainer className="m-auto flex !w-full max-w-[358px] flex-col p-4" radiusVariant="lg" variant="white">
        <Header />
        <RoundedContainer className="flex !w-full flex-col space-y-4 p-4" variant="white" radiusVariant="lg">
          <FakeInput />
          <OpenBrowserExplanation />
        </RoundedContainer>
        <p className="text-size-sm text-gray-80 mt-4 text-center">{t('web_view_explanation')}</p>
      </RoundedContainer>
    </div>
  );
};

export default UnsupportedWebView;
