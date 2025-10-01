import Spinner from 'components/Spinner/Spinner';

const LoadingScreen = () => (
  <div className="flex h-full w-full items-center justify-center">
    <Spinner variant="gray" size="xs" />
  </div>
);

export default LoadingScreen;
