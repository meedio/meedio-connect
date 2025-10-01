import { ReactComponent as Users } from 'assets/icons/Users.svg';

interface RoomActiveIndicatorProps {
  participantsCount: number;
}

const RoomActiveIndicator = ({ participantsCount }: RoomActiveIndicatorProps) => (
  <div className="h-10 min-w-fit px-2 sm:px-4 rounded-xl flex items-center justify-between bg-gray-20">
    <Users className="w-5 h-5 stroke-primary-50 stroke-2.5 m-1.5 shrink-0" />
    <span className="text-size-sm text-primary-50 font-medium">{participantsCount}</span>
  </div>
);

export default RoomActiveIndicator;
