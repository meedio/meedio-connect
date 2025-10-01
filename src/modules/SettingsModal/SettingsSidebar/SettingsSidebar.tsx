import Divider from '@shared/components/Divider/Divider';
import cx from 'classnames';

import LanguageSelect from 'components/LanguageSelect/LanguageSelect';
import { SetState } from 'utils/types';

import SidebarButton from './SidebarButton';
import { SettingsModalSize, Tab } from '../SettingsModal';

const sidebarSizes = {
  fullScreen: 'md:max-w-[256px]',
  md: 'md:max-w-[192px]',
};

interface SettingsSidebarProps {
  tabs: Tab[];
  activeTab: number;
  setActiveTab: SetState<number>;
  hasLanguageSelect: boolean;
  size: SettingsModalSize;
}

const SettingsSidebar = ({ tabs, activeTab, setActiveTab, hasLanguageSelect, size }: SettingsSidebarProps) => (
  <div
    className={cx(
      'border-grayscale-gray30 order-2 flex h-fit w-full flex-row items-center justify-center border-t p-4 md:order-1 md:h-full md:flex-col md:items-start md:justify-start md:border-r md:border-t-0',
      sidebarSizes[size]
    )}
  >
    <div className="flex w-fit space-x-2 md:w-full md:flex-col md:space-x-0 md:space-y-2">
      {tabs.map(({ icon, title, id, dataTestId }) => (
        <SidebarButton
          key={title}
          icon={icon}
          onClick={() => setActiveTab(id)}
          isActive={id === activeTab}
          dataTestId={dataTestId}
        >
          {title}
        </SidebarButton>
      ))}
    </div>
    {hasLanguageSelect && (
      <>
        <Divider verticalSpace="md" className="mt-auto hidden md:block" />
        <Divider verticalSpace="md" isVertical className="mx-4 block md:hidden" />
        <LanguageSelect flagNeeded />
      </>
    )}
  </div>
);

export default SettingsSidebar;
