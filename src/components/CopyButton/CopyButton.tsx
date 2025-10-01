import Button from '@shared/components/Button/Button';
import cx from 'classnames';
import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Copy } from 'assets/icons/Copy.svg';
import { ReactComponent as Lock } from 'assets/icons/Lock.svg';
import { ReactComponent as Tick } from 'assets/icons/Tick.svg';
import useToast from 'contexts/ToastProvider/useToast';
import useCopy from 'hooks/useCopy';
import useTheme from 'hooks/useTheme';
import testingConstants from 'utils/testingConstants';

export const url = window.location.host;
export const urlProtocol = window.location.protocol + '//';
export const urlWithProtocol = urlProtocol + url;

interface CopyButtonProps {
  link: string;
  hasToastOnCopy?: boolean;
  customToastText?: string;
  isWhite?: boolean;
  addProtocolOnCopy?: boolean;
  dataTestId?: string;
}

const CopyButton = ({
  link,
  hasToastOnCopy = true,
  customToastText,
  isWhite = false,
  addProtocolOnCopy = false,
  dataTestId,
}: CopyButtonProps) => {
  const { t } = useTranslation();
  const { isLightTheme } = useTheme();
  const { pushToast } = useToast();

  const toastText = customToastText ? customToastText : t('link_copied');
  const copyLink = (addProtocolOnCopy ? urlProtocol : '') + link;
  const { isCopied, copy } = useCopy(copyLink);

  const handleCopy = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    if (!isCopied) copy().then(() => hasToastOnCopy && pushToast({ variant: 'success', icon: Tick, title: toastText }));
  };

  const getCopyButtonGroupHoverClasses = () => {
    if (isCopied) return;

    return isWhite && !isLightTheme
      ? 'group-hover/copy:bg-gray-20 group-hover/copy:border-gray-20'
      : 'group-hover/copy:border-white group-hover/copy:!bg-white';
  };

  return (
    <div
      className={cx(
        'group/copy flex w-full border hover:border-primary-50 border-gray-40 justify-between space-x-2 overflow-hidden rounded-2xl p-1 pl-4 text-black',
        isWhite && 'dark:bg-white10 dark:text-white',
        isCopied ? 'cursor-default' : 'cursor-pointer'
      )}
      onClick={handleCopy}
    >
      <div className="flex w-full items-center justify-between space-x-3">
        <div className="flex items-center space-x-3 overflow-hidden">
          <Lock
            className={cx(
              'stroke-1.5 h-6 w-6 shrink-0',
              isWhite ? 'stroke-gray-80 dark:stroke-white' : 'stroke-gray-80'
            )}
          />
          <span className="truncate" data-testid={dataTestId}>
            {link}
          </span>
        </div>
        <Button
          onClick={handleCopy}
          variant={isWhite && !isLightTheme ? 'contrastGhost' : 'ghost'}
          size="sm"
          disabled={isCopied}
          className={cx(getCopyButtonGroupHoverClasses(), !isCopied && 'group-hover/copy:!text-black')}
          aria-label={t('copy_link')}
          data-testid={testingConstants.copyButton}
        >
          {isCopied ? (
            t('copied')
          ) : (
            <span className="inline-flex items-center">
              {t('copy')}
              <Copy
                data-testid={testingConstants.copyButtonIcon}
                className="stroke-1.5 ml-2 h-5 w-5 flex-shrink-0 stroke-current"
              />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CopyButton;
