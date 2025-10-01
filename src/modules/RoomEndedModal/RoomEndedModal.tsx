import Popup from '@shared/components/Popup/Popup';
import { PropsWithChildren } from 'react';

import ButtonsBlock from './ButtonsBlock';
import InformationBlock from './InformationBlock';

const RoomEndedModal = ({ children }: PropsWithChildren) => (
  <Popup.Container className="dark:bg-gray-90 !m-auto !max-h-unset space-y-4 bg-white p-4">{children}</Popup.Container>
);

RoomEndedModal.InformationBlock = InformationBlock;
RoomEndedModal.ButtonsBlock = ButtonsBlock;

export default RoomEndedModal;
