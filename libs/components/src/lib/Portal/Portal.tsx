import { PropsWithChildren, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import uuid4 from 'uuid4';

import { createWrapperAndAppendToBody } from './createWrapperAndAppendToBody';

interface PortalProps {
  wrapperId?: string;
}

const Portal = ({ children, wrapperId }: PropsWithChildren<PortalProps>) => {
  const [wrapperForPortal, setWrapperForPortal] = useState<Element>();
  const id = useMemo(() => wrapperId || uuid4(), [wrapperId]);

  useLayoutEffect(() => {
    const element = document.getElementById(id);

    if (!element) setWrapperForPortal(createWrapperAndAppendToBody(id));

    return () => wrapperForPortal?.remove();
  }, [id, wrapperForPortal]);

  if (!wrapperForPortal) return null;

  return createPortal(children, wrapperForPortal) as any;
};

export default Portal;
