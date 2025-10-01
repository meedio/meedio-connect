import { DiagnosticsPageLocationState } from 'pages/DiagnosticsPage/utils';

type DiagnosticsNavigateOptions = { state: DiagnosticsPageLocationState };
export type DiagnosticsNavigateFunction = (path: string, options: DiagnosticsNavigateOptions) => void;
