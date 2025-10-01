import PageWrapper from 'modules/PageWrapper';

type WithPageWrapperProps = {
  hasRightImage?: boolean;
};

const withPageWrapper =
  ({ hasRightImage }: WithPageWrapperProps = {}) =>
  (WrappedComponent: React.ComponentType) => {
    const WithPageWrapperComponent = () => (
      <PageWrapper hasRightImage={hasRightImage}>
        <WrappedComponent />
      </PageWrapper>
    );

    return WithPageWrapperComponent;
  };

export default withPageWrapper;
