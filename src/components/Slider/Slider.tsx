import { animated } from '@react-spring/web';
import cx from 'classnames';
import { CSSProperties, ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react';

interface SliderProps extends Pick<ComponentPropsWithoutRef<'div'>, 'onMouseDown' | 'onTouchStart'> {
  fillerStyle: CSSProperties;
  thumbStyle: CSSProperties;
  isVertical?: boolean;
}

const Slider = (
  { fillerStyle, thumbStyle, isVertical = false, onMouseDown, onTouchStart }: SliderProps,
  ref?: ForwardedRef<HTMLDivElement>
) => {
  const [parentClassNames, sliderClassNames, fillerClassNames, thumbClassNames] = isVertical
    ? ['w-1 h-full px-2.5', 'w-1 h-full -ml-0.5', 'rounded-b-100 w-1 bottom-0 -ml-0.5', '-mb-1.5 -ml-1.5']
    : ['w-full h-1 py-3', 'h-1 w-full top-2.5', 'rounded-l-100 h-1 top-2.5', '-mt-1 -ml-1.5 top-2.5'];

  return (
    <div
      className={cx('relative cursor-pointer', parentClassNames)}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      ref={ref}
    >
      <div className={cx('bg-white80 rounded-100 absolute', sliderClassNames)} />
      <animated.div className={cx('bg-complementary-50 absolute', fillerClassNames)} style={fillerStyle} />
      <animated.div
        className={cx('rounded-100 bg-complementary-50 absolute h-3 w-3 cursor-pointer', thumbClassNames)}
        style={thumbStyle}
      />
    </div>
  );
};

export default forwardRef(Slider);
