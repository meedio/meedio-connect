// eslint-disable-next-line @typescript-eslint/no-var-requires
const React = require('react');

const hasChildren = (node) => node && (node.children || (node.props && node.props.children));

const getChildren = (node) => (node && node.children ? node.children : node.props && node.props.children);

const renderNodes = (reactNodes) => {
  if (typeof reactNodes === 'string') return reactNodes;

  return Object.keys(reactNodes).map((key, i) => {
    const child = reactNodes[key];
    const isElement = React.isValidElement(child);

    if (typeof child === 'string') return child;
    if (hasChildren(child)) {
      const inner = renderNodes(getChildren(child));
      return React.cloneElement(child, { ...child.props, key: i }, inner);
    }
    if (typeof child === 'object' && !isElement) {
      return Object.keys(child).reduce((str, childKey) => `${str}${child[childKey]}`, '');
    }

    if (isElement) return React.cloneElement(child, { ...child.props, key: i });

    return child;
  });
};

const useMock = [(k) => k, {}];
useMock.t = (k) => k;
useMock.i18n = {};

module.exports = {
  Trans: ({ components, children }) =>
    !children ? renderNodes(components) : Array.isArray(children) ? renderNodes(children) : renderNodes([children]),
  useTranslation: () => useMock,
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
};
