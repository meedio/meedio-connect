import { ReactComponent as CircleCheck } from 'assets/icons/CircleCheck.svg';

type AliasAvailableProps = { alias: string };

const AliasAvailable = ({ alias }: AliasAvailableProps) => {
  const pathToRooms = `${document.location.href}rooms/`;

  return (
    <div className="flex items-center space-x-1">
      <CircleCheck className="stroke-primary-50" />
      <span className="text-size-sm text-primary-50 truncate whitespace-nowrap lowercase">
        {pathToRooms}
        <span className="font-semibold">{alias}</span>
      </span>
    </div>
  );
};

export default AliasAvailable;
