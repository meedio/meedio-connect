import Popup from '@shared/components/Popup/Popup';
import cx from 'classnames';
import { ComponentType, useState, Suspense } from 'react';

import { IconType } from 'utils/types';

import CenteredSpinner from './CenteredSpinner';
import SettingsSidebar from './SettingsSidebar/SettingsSidebar';

const modalSizes = {
  fullScreen: {
    popup: 'max-w-5xl',
    container: 'min-h-full',
  },
  md: {
    popup: 'max-w-[768px]',
    container: 'md:!h-[640px] min-h-full md:min-h-0',
  },
};

export type SettingsModalSize = keyof typeof modalSizes;

export interface Tab {
  id: number;
  title: string;
  icon: IconType;
  contentComponent: ComponentType;
  dataTestId?: string;
}

interface SettingsModalProps {
  title: string;
  tabs: Tab[];
  onClose: () => void;
  hasLanguageSelect?: boolean;
  size?: SettingsModalSize;
}

const SettingsModal = ({
  title,
  tabs,
  onClose,
  hasLanguageSelect = false,
  size = 'fullScreen',
}: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.contentComponent;

  if (!ActiveComponent) return null;

  return (
    <Popup
      isVisible
      closePopup={onClose}
      className={cx(
        '!my-0 !min-h-full !w-full md:!justify-center !justify-start overflow-hidden !p-6',
        modalSizes[size].popup
      )}
      wrapperId="settings-modal"
    >
      <Popup.Container className={cx('!max-w-unset !mt-0 w-full overflow-hidden', modalSizes[size].container)}>
        <div className="border-gray-20 flex items-center justify-between border-b px-6 py-4 font-medium text-black">
          <span className="text-size-xl font-medium">{title}</span>
          <Popup.CloseIcon className="relative !right-0" closePopup={onClose} />
        </div>
        <div className="flex h-full w-full flex-col overflow-hidden md:flex-row">
          <SettingsSidebar
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            hasLanguageSelect={hasLanguageSelect}
            size={size}
          />
          <div className="bg-grayscale-gray10 order-1 h-full w-full overflow-y-auto p-4 md:order-2">
            <Suspense fallback={<CenteredSpinner />}>
              <ActiveComponent />
            </Suspense>
          </div>
        </div>
      </Popup.Container>
    </Popup>
  );
};

export default SettingsModal;
