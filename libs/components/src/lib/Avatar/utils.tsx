export const getInitials = (name?: string) => {
  if (!name) return;

  const split = name
    .replace(/[^\p{L}\s]/giu, '')
    .trim()
    .split(' ');

  const [firstName] = split;

  let [initials] = firstName;

  if (split.length > 1) {
    const [secondInitial] = split[split.length - 1];
    initials += secondInitial;
  }

  initials = initials && initials.toUpperCase();

  return initials;
};
