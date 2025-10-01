import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@shared/components/Button/Button';
import ErrorMessage from '@shared/components/ErrorMessage/ErrorMessage';
import cx from 'classnames';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ReactComponent as ArrowBack } from 'assets/icons/ArrowBack.svg';
import useUpdateFeedback from 'hooks/useUpdateFeedback/useUpdateFeedback';
import { Schemas } from 'utils/yup/schemas/validationSchemas';

interface FeedbackPopupFormProps {
  issueId?: number;
  onGoBack: () => void;
}

export interface FeedbackPopupForm {
  feedbackComment: string;
}

const FeedbackPopupForm = ({ issueId, onGoBack }: FeedbackPopupFormProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: {
      errors: { feedbackComment: feedbackCommentError },
      isValid,
    },
  } = useForm<FeedbackPopupForm>({ resolver: yupResolver(Schemas.getFeedbackValidation()), mode: 'onChange' });
  const { updateFeedbackAndFinish } = useUpdateFeedback();

  const handleFormSubmit = ({ feedbackComment }: FeedbackPopupForm) =>
    updateFeedbackAndFinish({ comment: feedbackComment, issueId });

  return (
    <>
      <Button variant="textSecondary" className="flex p-1.5 group !text-size-sm !font-medium" onClick={onGoBack}>
        <ArrowBack className="stroke-black group-hover:stroke-primary-50 stroke-1.5 w-5 h-5 mr-4" />
        {t('feedback.other')}
      </Button>
      <form className="w-full space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
        <textarea
          {...register('feedbackComment')}
          rows={3}
          autoComplete="off"
          placeholder={t('feedback.text_placeholder')}
          className={cx(
            'text-size-sm focus:ring-gray-30 h-24 placeholder:text-gray-70 focus:border-gray-40 border-transparent w-full resize-none rounded-xl bg-gray-10 font-light focus:outline-none focus:ring-2',
            { '!border-red-400': feedbackCommentError }
          )}
        />
        <ErrorMessage message={feedbackCommentError?.message} />
        <Button variant="primary" type="submit" disabled={!isValid} className="w-full">
          {t('feedback.submit')}
        </Button>
      </form>
    </>
  );
};

export default FeedbackPopupForm;
