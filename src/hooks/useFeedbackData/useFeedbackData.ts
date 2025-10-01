import { useLocation, useParams } from 'react-router-dom';
import UAParser from 'ua-parser-js';

import useCookies from 'hooks/useCookies';
import { RoomEndedPageState } from 'pages/RoomEndedPage/RoomEndedPage';
import { getIsMobile } from 'utils/browsers';
import { matrixConstants } from 'utils/Constants';

type FeedbackMetadataType = {
  device: {
    browser: string;
    os: string;
    type: string;
  };
  user: {
    matrix_id?: string;
  };
  video_session: {
    slug?: string;
    matrix_room_id?: string;
  };
  app: string;
};

const useFeedbackData = (): FeedbackMetadataType => {
  const [matrixId] = useCookies<string | undefined>(matrixConstants.MX_USER_ID, undefined);
  const { roomId } = useParams();
  const { state } = useLocation();
  const { matrixRoomId } = (state as RoomEndedPageState) || { matrixRoomId: null };

  const parser = new UAParser(navigator.userAgent);
  const os = parser.getOS();
  const osString = `${os.name} ${os.version}`;
  const browser = parser.getBrowser();
  const browserString = `${browser.name} ${browser.version}`;
  const app = 'meedio-connect';

  const metadata = {
    app,
    user: { matrix_id: matrixId },
    device: {
      browser: browserString,
      os: osString,
      type: getIsMobile() ? 'mobile' : 'desktop',
    },
    video_session: {
      room_path: roomId,
      matrix_room_id: matrixRoomId,
    },
  };

  return metadata;
};

export default useFeedbackData;
