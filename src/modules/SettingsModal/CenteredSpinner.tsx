import Spinner from 'components/Spinner/Spinner';

const CenteredSpinner = () => (
  <div className="flex justify-center items-center w-full h-full">
    <Spinner variant="gray" size="xs" />
  </div>
);

export default CenteredSpinner;
