import { ReactComponent as Clock } from 'assets/icons/Clock.svg';

interface RoomInfoBlockProps {
  subtitle: string;
  title?: string;
}

const RoomInfoBlock = ({ subtitle, title }: RoomInfoBlockProps) => (
  <div className="flex gap-2 align-top p-4 rounded-2xl bg-white10">
    <Clock className="h-6 w-6 shrink-0 stroke-white stroke-1.5" />
    <div className="flex flex-col w-full gap-2 text-size-xs md:text-size-sm text-left dark:text-white rounded-md">
      {title && <p className="w-fit font-bold">{title}</p>}
      <p className="w-fit">{subtitle}</p>
    </div>
  </div>
);

export default RoomInfoBlock;
