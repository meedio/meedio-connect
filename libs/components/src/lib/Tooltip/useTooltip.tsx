import {
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useDismiss,
  arrow,
  Placement,
  useClick,
  useDelayGroupContext,
  useDelayGroup,
} from '@floating-ui/react-dom-interactions';
import { useEffect, useRef, useState } from 'react';

import { TooltipType } from './Tooltip';
import { arrowDirections, ArrowDirectionType } from './utils';

const useTooltip = (
  label: string,
  placement: Placement,
  type: TooltipType,
  inGroup: boolean,
  hoverDesktopOnly: boolean,
  isVisible?: boolean
) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);
  const { delay: delayFromContext, setCurrentId } = useDelayGroupContext();

  const isVisibilityControlled = isVisible !== undefined;

  const onOpenChange = (open: boolean) => {
    if (isVisibilityControlled) return;

    setOpen(open);
    if (open && inGroup) setCurrentId(label);
  };

  const middleware = [offset(8), flip(), shift({ padding: 4 }), arrow({ element: arrowRef, padding: 16 })];

  const {
    x,
    y,
    reference: ref,
    floating,
    strategy,
    context,
    placement: currentPlacement,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
  } = useFloating({
    placement,
    open,
    onOpenChange,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  const isHover = type === 'hover';
  const isClick = type === 'click';
  const delay = inGroup ? delayFromContext : { open: 0, close: 0 };
  const id = (inGroup && label) || '';

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { enabled: isHover, delay, move: !inGroup, mouseOnly: hoverDesktopOnly }),
    useClick(context, { enabled: isClick, toggle: false }),
    useDismiss(context, { referencePressEvent: inGroup ? 'pointerdown' : undefined }),
    useDelayGroup(context, { id }),
  ]);

  const tooltipDirection = (currentPlacement.split('-')[0] || 'top') as ArrowDirectionType;
  const arrowDirection = arrowDirections[tooltipDirection] as ArrowDirectionType;

  const tooltipPlacement = {
    position: strategy,
    top: y ?? '',
    left: x ?? '',
  };

  const arrowPlacement = {
    top: arrowY ?? '',
    left: arrowX ?? '',
    [arrowDirection]: '-4px',
  };

  useEffect(() => {
    if (isVisibilityControlled) setOpen(isVisible);
    if (!open || type !== 'click' || isVisibilityControlled) return;

    const timeoutId = setTimeout(() => setOpen(false), 2000);

    return () => clearTimeout(timeoutId);
  }, [isVisibilityControlled, isVisible, open, type]);

  return {
    arrowX,
    arrowY,
    arrowRef,
    ref,
    open,
    floating,
    tooltipPlacement,
    arrowPlacement,
    getReferenceProps,
    getFloatingProps,
  };
};

export default useTooltip;
