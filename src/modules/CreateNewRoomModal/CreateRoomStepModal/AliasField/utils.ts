import slugifyText from 'slugify';

export enum MatrixErrorEnum {
  M_NOT_FOUND = 'M_NOT_FOUND',
}

export const MAX_ALIAS_RETRY_COUNT = 10;

export const slugifyExtended = (text: string) => slugifyText(text, { lower: true, remove: /[%<>&$]/g, strict: true });
export const getIsMatrixError = (error: unknown) => typeof error === 'object' && error !== null && 'errcode' in error;
