import cx from 'classnames';

import { ReactComponent as Tick } from '../../assets/icons/Tick.svg';
import { ReactComponent as X } from '../../assets/icons/X.svg';

export interface ActionsProps {
  onAllow: () => void;
  onDeny: () => void;
}

const Actions = ({ onAllow, onDeny }: ActionsProps) => {
  const defaultClasses = 'w-6 h-6 stroke-current text-gray-60';

  return (
    <div className="flex flex-row">
      <div className="cursor-pointer p-1" onClick={onAllow}>
        <Tick className={defaultClasses} />
      </div>
      <div className="cursor-pointer p-1" onClick={onDeny}>
        <X className={cx('ml-2', defaultClasses)} />
      </div>
    </div>
  );
};

export default Actions;
