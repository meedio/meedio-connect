import { ReactComponent as LinkNew } from 'assets/icons/LinkNew.svg';
import CopyButton from 'components/CopyButton/CopyButton';

type ShareRoomButtonBlockProps = {
  link: string;
  label: string;
};

const ShareRoomButtonBlock = ({ link, label }: ShareRoomButtonBlockProps) => (
  <div className="flex space-x-6">
    <LinkNew className="stroke-gray-60 mt-3 h-6 w-6 shrink-0 stroke-1.5" />
    <div className="flex w-full min-w-0 flex-col space-y-2">
      <span className="text-sm font-light text-grayscale-black">{label}</span>
      <div className="flex space-x-2">
        <CopyButton link={link} />
      </div>
    </div>
  </div>
);

export default ShareRoomButtonBlock;
