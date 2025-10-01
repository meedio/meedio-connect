import UnexpectedError from '@shared/components/ErrorBoundaryComponent/UnexpectedError/UnexpectedError';
import { ComponentType, LazyExoticComponent, PropsWithChildren } from 'react';
import { Route } from 'react-router-dom';

import pipe from 'utils/pipe';

type LazyComponent =
  | LazyExoticComponent<ComponentType<unknown>>
  | LazyExoticComponent<ComponentType<PropsWithChildren>>;

type CreateRoutesProps = {
  path: string | string[];
  component?: LazyComponent;
  element?: JSX.Element;
  // eslint-disable-next-line @typescript-eslint/ban-types
  hocs?: Function[];
  children?: Omit<CreateRoutesProps[], 'children'>;
};

export const createRoute = ({ component, element, hocs, path, children }: CreateRoutesProps): JSX.Element[] => {
  let elementToRender = element;
  if (!elementToRender && component) {
    const Component = (hocs ? pipe(...hocs)(component) : component) as LazyComponent;
    elementToRender = <Component />;
  }

  if (!elementToRender) throw new Error('Element or component must be provided to create a route');

  const isPathArray = Array.isArray(path);
  const pathsToRender = isPathArray ? path : [path];

  const parentRoutes = pathsToRender.map((path) => (
    <Route key={path} path={path} element={elementToRender} errorElement={<UnexpectedError />} />
  ));

  const childRoutes =
    children?.flatMap((child) => {
      const childPaths = Array.isArray(child.path) ? child.path : [child.path];

      return childPaths.flatMap((childPath) => {
        const fullPaths = pathsToRender.map((parentPath) => `${parentPath}${childPath}`);

        return createRoute({ ...child, path: fullPaths, children: child.children });
      });
    }) || [];

  return [...parentRoutes, ...childRoutes];
};

export const createRoutes = (routes: CreateRoutesProps[]) => routes.map((route) => createRoute(route));
