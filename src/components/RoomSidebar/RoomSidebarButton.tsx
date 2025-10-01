import Button, { ButtonVariant } from '@shared/components/Button/Button';
import { HTMLAttributes, PropsWithChildren } from 'react';

interface RoomSidebarButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const RoomSidebarButton = ({
  children,
  variant = 'secondaryTertiary',
  onClick,
  isDisabled,
  isLoading,
  ...rest
}: PropsWithChildren<RoomSidebarButtonProps>) => (
  <Button
    {...rest}
    onClick={onClick}
    variant={variant}
    disabled={isDisabled}
    loading={isLoading}
    className="w-fit truncate"
    size="sm"
  >
    <span className="text-size-sm font-medium leading-5">{children}</span>
  </Button>
);

export default RoomSidebarButton;
