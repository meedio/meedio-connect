import { ReactComponent as Router } from 'assets/icons/Router.svg';
import { ReactComponent as Wifi } from 'assets/icons/Wifi.svg';

export enum DiagnosticsIssuesEnum {
  NO_INTERNET = 'NO_INTERNET',
  HIGH_LATENCY = 'HIGH_LATENCY',
}

// NOTE: mocks for now, so no translations will be added
const getDiagnosticsRecommendationsItems = () => [
  {
    id: DiagnosticsIssuesEnum.NO_INTERNET,
    icon: Wifi,
    title: 'Internet access',
    description: 'Check if your internet connection is working.',
  },
  {
    id: DiagnosticsIssuesEnum.HIGH_LATENCY,
    icon: Router,
    title: 'High Latency',
    description: 'Try avoiding activities that could consume your traffic.',
  },
];

export default getDiagnosticsRecommendationsItems;
