import { ReactComponent as Router } from 'assets/icons/Router.svg';
import { ReactComponent as Wifi } from 'assets/icons/Wifi.svg';
import { FailureLevelsEnum } from 'pages/DiagnosticsPage/utils';
import { IconType } from 'utils/types';

export enum DiagnosticIssuesEnum {
  NO_INTERNET = 'NO_INTERNET',
  HIGH_LATENCY = 'HIGH_LATENCY',
}

export type DiagnosticRecommendationType = {
  id: DiagnosticIssuesEnum;
  icon: IconType;
  title: string;
  description: string;
  failureLevel: FailureLevelsEnum;
};

// NOTE: mocks for now, so no translations will be added
const getDiagnosticRecommendations = (): DiagnosticRecommendationType[] => [
  {
    id: DiagnosticIssuesEnum.NO_INTERNET,
    icon: Wifi,
    title: 'Internet access',
    description: 'Check if your internet connection is working.',
    failureLevel: FailureLevelsEnum.CRITICAL,
  },
  {
    id: DiagnosticIssuesEnum.HIGH_LATENCY,
    icon: Router,
    title: 'High Latency',
    description: 'Try avoiding activities that could consume your traffic.',
    failureLevel: FailureLevelsEnum.WARNING,
  },
];

export default getDiagnosticRecommendations;
