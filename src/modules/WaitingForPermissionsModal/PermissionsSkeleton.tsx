import Button from '@shared/components/Button/Button';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Microphone } from 'assets/icons/Microphone.svg';
import { ReactComponent as Video } from 'assets/icons/Video.svg';

const iconStyle = 'h-6 w-6 stroke-1.5 stroke-gray-60';

interface SkeletonTextProps {
  className?: string;
}

const SkeletonText = ({ className }: SkeletonTextProps) => (
  <div className={cx('h-3 bg-gray-40 rounded-xl', className)} />
);

const PermissionsSkeleton = () => {
  const { t } = useTranslation();

  return (
    <div className="shadow-icon bg-gradient-white w-full rounded-3xl p-2">
      <div className="rounded-2xl p-4 bg-gradient-green space-y-2">
        <SkeletonText className="w-[180px]" />
        {[Video, Microphone].map((Icon, i) => (
          <div className="flex space-x-2 items-center" key={i}>
            <Icon className={iconStyle} />
            <SkeletonText className={!i ? 'w-20' : 'w-24'} />
          </div>
        ))}
        <div className="flex space-x-2 justify-end">
          <div className="border border-gray-40 flex rounded-xl h-10 w-20">
            <SkeletonText className="w-12 m-auto" />
          </div>
          <Button variant="primary" size="sm" className="pointer-events-none w-fit min-w-[80px]">
            {t('allow')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsSkeleton;
