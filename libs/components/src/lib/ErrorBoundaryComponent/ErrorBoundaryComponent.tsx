import * as Sentry from '@sentry/react';
import React, { ReactNode } from 'react';

import UnexpectedError from './UnexpectedError/UnexpectedError';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.log(error);
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) return <UnexpectedError />;

    return this.props.children;
  }
}

export default ErrorBoundary;
