import Button from '@shared/components/Button/Button';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowRight } from 'assets/icons/ArrowRight.svg';
import MeedioConnectMeetingBrowser from 'assets/images/MeedioConnectMeetingBrowser.png';
import MeedioConnectMeetingMobile from 'assets/images/MeedioConnectMeetingMobile.png';
import useInitiateMatrixSSORedirect from 'hooks/useInitiateMatrixSSORedirect';
import SelectHomeserver from 'modules/Authentication/HomeserverSelection/SelectHomeserver';
import useMxCookies from 'modules/Authentication/hooks/useMxCookies';

const Images = () => (
  <div className="relative flex lg:mt-0 w-full h-full lg:translate-x-[-20%]">
    <div className="lg:top-1/2 lg:-left-0 absolute inset-x-0 mx-auto w-[340px] sm:w-[400px] md:w-[480px] lg:w-[2000px] lg:h-[80vh] lg:min-h-[450px] lg:-translate-y-1/2">
      <picture>
        <source srcSet={MeedioConnectMeetingBrowser} type="image/png" />
        <img
          src={MeedioConnectMeetingBrowser}
          alt="MeedioConnectMeetingBrowser"
          className="lg:left-[37px] z-10 absolute lg:h-[82%]"
        />
      </picture>
      <picture>
        <source srcSet={MeedioConnectMeetingMobile} type="image/png" />
        <img
          src={MeedioConnectMeetingMobile}
          alt="MeedioConnectMeetingMobile"
          className="top-12 sm:top-14 md:top-16 lg:top-auto lg:bottom-0 -left-3 md:-left-6 lg:left-0 z-10 absolute w-[120px] sm:w-[140px] md:w-[180px] lg:w-auto h-auto lg:h-[82%]"
        />
      </picture>
    </div>
  </div>
);

const AuthenticationPage = () => {
  const { t } = useTranslation();
  const initiateMatrixSSORedirect = useInitiateMatrixSSORedirect();
  const [customMatrixUrl, setCustomMatrixUrl] = useState<string | null>(null);
  const { mxLoggedIn } = useMxCookies();
  const navigate = useNavigate();

  const authenticate = () => initiateMatrixSSORedirect(customMatrixUrl);
  // We don't want authenticated users to be able to access the authentication page
  if (mxLoggedIn) navigate('/');

  return (
    <div className="gap-0 lg:gap8 grid lg:grid-cols-2 lg:grid-rows-1 w-full lg:h-full lg:overflow-x-hidden">
      <div className="my-auto px-6 sm:px-[25%] w-screen sm:w-full">
        <div className="z-0 mb-12">
          <div className="mt-7">
            <h3 className="font-light text-4xl">{t('simple_fast_reliable')}</h3>
            <h3 className="text-4xl">{t('your_new_video_call_platform')}</h3>
          </div>
          <Button onClick={authenticate} className="my-4 w-full" variant="primary">
            {t('authenticate_to_start')}
            <ArrowRight className="ml-2 stroke-current text-white" />
          </Button>
          <SelectHomeserver setCustomMatrixUrl={setCustomMatrixUrl} />
        </div>
      </div>
      <div className="lg:bg-gray-10 w-full h-full">
        <Images />
      </div>
    </div>
  );
};

export default AuthenticationPage;
