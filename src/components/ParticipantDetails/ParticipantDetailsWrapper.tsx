import cx from 'classnames';
import { ForwardedRef, PropsWithChildren, ReactNode, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import constants from 'Constants';

const participantDetailsPositions = {
  topLeft: 'top-0 left-0',
  bottomLeft: 'bottom-0 left-0',
};

type ParticipantDetailsPositions = keyof typeof participantDetailsPositions;

interface ParticipantDetailsWrapperProps {
  className?: string;
  containerClassName?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  position?: ParticipantDetailsPositions;
}

const ParticipantDetailsWrapper = (
  {
    children,
    className,
    containerClassName,
    iconLeft,
    iconRight,
    position = 'bottomLeft',
  }: PropsWithChildren<ParticipantDetailsWrapperProps>,
  ref?: ForwardedRef<HTMLDivElement>
) => {
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        'absolute z-10 my-2 flex max-w-full cursor-auto items-end space-x-1 px-2',
        participantDetailsPositions[position],
        className
      )}
      id={constants.PARTICIPANT_DETAILS_ID}
    >
      <div
        className={cx(
          'bg-black80 flex h-6 items-center space-x-1 overflow-hidden rounded-full px-1.5 py-0.5 text-white',
          { 'pl-0.5': iconLeft, 'pr-0.5': iconRight },
          containerClassName
        )}
        ref={ref}
      >
        {iconLeft}
        <span className="text-size-xs truncate text-white" translate="no">
          {children || t('participant')}
        </span>
        {iconRight}
      </div>
    </div>
  );
};

export default forwardRef(ParticipantDetailsWrapper);
