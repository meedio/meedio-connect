import Button from '@shared/components/Button/Button';
import Popup from '@shared/components/Popup/Popup';
import cx from 'classnames';

import testingConstants from 'utils/testingConstants';

const footerButtonClass = 'w-full md:w-fit';

interface ModalFooterProps {
  cancelText: string;
  successButtonText: string;
  onCloseClick: () => void;
  onSubmit: () => void;
  successDisabled?: boolean;
  isLoading?: boolean;
  isCancelButtonHidden?: boolean;
}

const ModalFooter = ({
  cancelText,
  successButtonText,
  onCloseClick,
  onSubmit,
  successDisabled = false,
  isLoading = false,
  isCancelButtonHidden = false,
}: ModalFooterProps) => (
  <Popup.Footer wrapperClassName="!pb-4 !px-4" className="w-full gap-4 !pt-4 md:justify-end">
    {!isCancelButtonHidden && (
      <Button variant="tertiary" className={footerButtonClass} onClick={onCloseClick}>
        {cancelText}
      </Button>
    )}
    <Button
      variant="primary"
      onClick={onSubmit}
      loading={isLoading}
      disabled={successDisabled || isLoading}
      className={cx('capitalize', footerButtonClass)}
      data-testid={testingConstants.submitFormButton}
    >
      {successButtonText}
    </Button>
  </Popup.Footer>
);

export default ModalFooter;
