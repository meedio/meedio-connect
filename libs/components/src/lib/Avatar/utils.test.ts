import { getInitials } from './utils';

describe('avatar test suite', () => {
  it('should allow lithuanian and denmark languages', () => {
    const initials = getInitials('Žydrūnas ~ @ # $ % ^ & * ( ) " : (Ævickas) ');
    expect(initials).toBe('ŽÆ');
  });
});
