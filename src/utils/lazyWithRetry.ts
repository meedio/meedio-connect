import ImportFailed from '@shared/components/ImportFailed/ImportFailed';
import Cookies, { CookieAttributes } from 'js-cookie';
import { lazy, ComponentType, LazyExoticComponent } from 'react';

import { cookieDomain } from 'hooks/useCookies';
import constants, { COOKIE_KEY_PREFIX } from 'utils/Constants';

type DefaultLazyComponent<T> = { default: T };

const HAS_IMPORT_ERROR = `${COOKIE_KEY_PREFIX}_has-import-error`;
const RELOAD_TIMESTAMP = `${COOKIE_KEY_PREFIX}_reload-timestamp`;
const cookieOptions: CookieAttributes = { domain: cookieDomain, expires: 365, sameSite: 'Lax' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyWithRetry = <T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): LazyExoticComponent<T> =>
  lazy(async () => {
    try {
      const component = await componentImport();

      Cookies.set(HAS_IMPORT_ERROR, 'false', cookieOptions);

      return component;
    } catch (error) {
      const hasError = Boolean(JSON.parse(Cookies.get(HAS_IMPORT_ERROR) || 'false'));
      if (hasError) {
        console.error(error);
        return { default: ImportFailed } as unknown as DefaultLazyComponent<T>;
      }

      const now = Date.now();
      const reloadTimestamp = Number(JSON.parse(Cookies.get(RELOAD_TIMESTAMP) || '0'));
      const shouldReload = !reloadTimestamp || reloadTimestamp + 10000 < now;
      const isRedirectPending = Boolean(JSON.parse(localStorage.getItem(constants.REDIRECT_INITIATED) || 'false'));

      if (shouldReload && !isRedirectPending) {
        Cookies.set(RELOAD_TIMESTAMP, now.toString(), cookieOptions);
        Cookies.set(HAS_IMPORT_ERROR, 'true', cookieOptions);
        window.location.reload();
      }

      return { default: () => null } as unknown as DefaultLazyComponent<T>;
    }
  });

export default lazyWithRetry;
