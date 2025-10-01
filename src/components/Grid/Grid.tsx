import cx from 'classnames';
import { PropsWithChildren } from 'react';

interface ClassNameProp {
  className?: string;
}

const Column = ({ children, className }: PropsWithChildren<ClassNameProp>) => (
  <div className={cx('flex justify-center', className)}>{children}</div>
);

const Grid = ({ children, className }: PropsWithChildren<ClassNameProp>) => (
  <div className={cx('grid', className)}>{children}</div>
);

Grid.Column = Column;

export default Grid;
