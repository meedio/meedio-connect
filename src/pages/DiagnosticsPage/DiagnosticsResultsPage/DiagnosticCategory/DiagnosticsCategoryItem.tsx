import cx from 'classnames';

import { IconType } from 'utils/types';

import { diagnosticCategoryVariants, DiagnosticCategoryVariantType } from './DiagnosticCategory';

interface DiagnosticsCategoryItemProps {
  title: string;
  subtitle: string;
  status: string;
  icon: IconType;
  variant: DiagnosticCategoryVariantType;
  hasIconColor?: boolean;
}

const DiagnosticsCategoryItem = ({
  title,
  subtitle,
  status,
  icon: Icon,
  variant,
  hasIconColor = true,
}: DiagnosticsCategoryItemProps) => {
  const { textColor } = diagnosticCategoryVariants[variant];

  return (
    <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center text-size-sm space-y-2 xs:space-y-0 xs:space-x-4">
      <div className="space-y-1">
        <div className={cx('font-medium', textColor)}>{title}</div>
        <div className="text-gray-80 font-light">{subtitle}</div>
      </div>
      <div className="space-x-2 flex items-center">
        <div className={cx('font-medium whitespace-nowrap', textColor)}>{status}</div>
        <Icon
          className={cx('h-6 w-6 shrink-0', { 'stroke-current stroke-1.5': hasIconColor, [textColor]: hasIconColor })}
        />
      </div>
    </div>
  );
};

export default DiagnosticsCategoryItem;
