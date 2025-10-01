import ButtonComponent from '@shared/components/Button/Button';
import ControlButtonComponent from '@shared/components/ControlButton/ControlButton';

import withClickLog from './withClickLog';

const ControlButtonWithLogging = withClickLog(ControlButtonComponent);
const ButtonWithLogging = withClickLog(ButtonComponent);

export { ControlButtonWithLogging, ButtonWithLogging };
