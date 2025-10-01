import tlds from 'tlds';
import * as yup from 'yup';

yup.addMethod<yup.StringSchema>(yup.string, 'validEmailTld', function (message: string) {
  return this.test({
    name: 'valid-email-tld',
    message,
    test(value) {
      if (!value) return true;
      const [currentTld] = value.split('.').slice(-1);
      return tlds.includes(currentTld.toLowerCase());
    },
  });
});

yup.addMethod<yup.StringSchema>(
  yup.string,
  'emailIsNotDuplicateInArray',
  function (message: string, listField: string) {
    return this.test({
      name: 'email-is-not-duplicate-in-array',
      message,
      test(value, ctx) {
        if (!value) return true;
        const participants: string[] = ctx.resolve(yup.ref(listField)) || [];
        return !participants.includes(value.toLowerCase());
      },
    });
  }
);

declare module 'yup' {
  interface StringSchema {
    emailIsNotDuplicateInArray(message: string, listField: string): StringSchema;
    validEmailTld(message: string): StringSchema;
  }
}
