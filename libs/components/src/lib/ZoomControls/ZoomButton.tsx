import { ButtonOnClick } from './ZoomControls';
import { IconType } from '../../utils/types';
import Button from '../Button/Button';

interface ZoomButtonProps {
  icon: IconType;
  onClick: ButtonOnClick;
}

const ZoomButton = ({ icon: Icon, onClick }: ZoomButtonProps) => (
  <Button variant="buttonIconContrastGhost" size="neutral" className="rounded-xl p-1.5" onClick={onClick}>
    <Icon className="stroke-1.5 h-5 w-5 stroke-current" />
  </Button>
);

export default ZoomButton;
