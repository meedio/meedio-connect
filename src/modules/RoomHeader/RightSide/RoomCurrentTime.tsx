import Timer from 'components/Timer/Timer';
import useTheme from 'hooks/useTheme';

const RoomCurrentTime = () => {
  const { timerVariant } = useTheme();

  return <Timer variant={timerVariant} className="hidden md:inline-flex" />;
};

export default RoomCurrentTime;
