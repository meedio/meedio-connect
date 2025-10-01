import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';

import CollapsibleContent from './CollapsibleContent';
import CollapsibleHead from './CollapsibleHead/CollapsibleHead';
import CollapsibleToggle from './CollapsibleHead/CollapsibleToggle';

type CollapsibleContextType = {
  isCollapsed: boolean;
  isCollapsible: boolean;
  toggleIsCollapsed: () => void;
};

export const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

interface CollapsibleProps {
  isInitiallyCollapsed?: boolean;
  isCollapsible?: boolean;
}

const Collapsible = ({
  children,
  isInitiallyCollapsed = true,
  isCollapsible = true,
}: PropsWithChildren<CollapsibleProps>) => {
  const [isCollapsed, setIsCollapsed] = useState(isInitiallyCollapsed);

  const toggleIsCollapsed = useCallback(() => setIsCollapsed((prev) => !prev), []);

  // NOTE: reset if isCollapsible prop changes. Add a prop for this if there is a need to avoid this behavior
  useEffect(() => {
    setIsCollapsed(isInitiallyCollapsed);
  }, [isCollapsible, isInitiallyCollapsed]);

  return (
    <CollapsibleContext.Provider value={{ isCollapsed, toggleIsCollapsed, isCollapsible }}>
      {children}
    </CollapsibleContext.Provider>
  );
};

Collapsible.Head = CollapsibleHead;
Collapsible.Content = CollapsibleContent;
Collapsible.Toggle = CollapsibleToggle;

export default Collapsible;
