import cx from 'classnames';
import { PropsWithChildren } from 'react';

import Spinner from 'components/Spinner/Spinner';
import Collapsible from 'modules/Collapsible/Collapsible';
import { IconType } from 'utils/types';

import DiagnosticsCategoryItem from './DiagnosticsCategoryItem';

export const diagnosticCategoryVariants = {
  success: { bgColor: 'bg-success-10', textColor: 'text-primary-70' },
  warning: { bgColor: 'bg-warning-10', textColor: 'text-warning-50' },
  error: { bgColor: 'bg-error-10', textColor: 'text-error-50' },
  neutral: { bgColor: 'bg-gray-20', textColor: 'text-gray-80' },
};

export type DiagnosticCategoryVariantType = keyof typeof diagnosticCategoryVariants;

interface DiagnosticsCategoryProps {
  icon: IconType;
  title: string;
  subtitle: string;
  variant: DiagnosticCategoryVariantType;
  isLoading?: boolean;
  isCollapsible?: boolean;
}

const DiagnosticsCategory = ({
  children,
  icon: Icon,
  title,
  subtitle,
  variant,
  isLoading = false,
  isCollapsible = true,
}: PropsWithChildren<DiagnosticsCategoryProps>) => {
  const { bgColor, textColor } = diagnosticCategoryVariants[variant];

  return (
    <div className="w-full bg-white border border-gray-30 rounded-2xl">
      <Collapsible isCollapsible={isCollapsible}>
        <Collapsible.Head>
          <div className="flex space-x-2">
            <div className={cx('p-1 h-fit rounded-lg', bgColor)}>
              {isLoading ? (
                <Spinner size="xxxs" variant="black" />
              ) : (
                <Icon className={cx('stroke-current h-4 w-4', textColor)} />
              )}
            </div>
            <div className="space-y-2">
              <p className="font-medium text-black">{title}</p>
              <p className={cx('text-size-sm', textColor)}>{subtitle}</p>
            </div>
          </div>
          <Collapsible.Toggle />
        </Collapsible.Head>
        <Collapsible.Content>{children}</Collapsible.Content>
      </Collapsible>
    </div>
  );
};

DiagnosticsCategory.Item = DiagnosticsCategoryItem;

export default DiagnosticsCategory;
