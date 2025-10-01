import { IconType } from 'utils/types';

interface RecommendationsItemProps {
  icon: IconType;
  title: string;
  description: string;
}

const RecommendationsItem = ({ icon: Icon, title, description }: RecommendationsItemProps) => (
  <div className="flex space-x-2">
    <Icon className="stroke-black stroke-1.5 h-6 w-6" />
    <div className="space-y-1">
      <p className="font-medium text-black">{title}</p>
      <p className="text-gray-80">{description}</p>
    </div>
  </div>
);

export default RecommendationsItem;
