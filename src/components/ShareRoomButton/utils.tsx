import cx from 'classnames';

import { ReactComponent as CopyLink } from 'assets/icons/CopyLink.svg';
import { ReactComponent as Email } from 'assets/icons/Email.svg';
import { ReactComponent as Gmail } from 'assets/icons/Gmail.svg';
import { ReactComponent as Outlook } from 'assets/icons/Outlook.svg';
import i18n from 'i18n/config';
import { openExternalWindow } from 'utils/utils';

const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

const getMailContent = (link: string) => {
  const subject = i18n.t('mail_subject');
  const bodyGreeting = i18n.t('mail_body_greeting');
  const bodyInvitation = i18n.t('mail_body_invitation');
  const bodyWishes = i18n.t('mail_body_wishes');
  const body = encodeURIComponent([bodyGreeting, '\n\n', bodyInvitation, '\n\n', link, '\n\n', bodyWishes].join(' '));

  return { subject, body };
};

const getMailLink = (link: string) => {
  const { subject, body } = getMailContent(link);

  return `mailto:?subject=${subject}&body=${body}`;
};

const getGmailLink = (link: string) => {
  const { subject, body } = getMailContent(link);

  return `https://mail.google.com?view=cm&tf=0&su=${subject}&body=${body}`;
};

export const getEmailOptions = (isMobile: boolean, onCopyCompleted: () => void) => {
  const link = window.location.href;
  const iconStyle = 'mr-2';

  const defaultEmailOptions = [
    {
      title: i18n.t('send_email'),
      icon: <Email className={iconStyle} />,
      onClick: () => openExternalWindow(getMailLink(link)),
      hasDivider: true,
    },
    {
      title: i18n.t('copy_link'),
      icon: <CopyLink className={cx(' stroke-current stroke-2 text-gray-100', iconStyle)} />,
      onClick: () => copyToClipboard(link).then(onCopyCompleted),
    },
  ];

  // NOTE: we return only mail and copylink on mobile since gmail/outlook navigate to the mail app on IOS either way.
  if (isMobile) return defaultEmailOptions;

  return [
    {
      title: i18n.t('send_with', { mail: 'Gmail' }),
      icon: <Gmail className={iconStyle} />,
      onClick: () => openExternalWindow(getGmailLink(link)),
    },
    {
      title: i18n.t('send_with', { mail: 'Outlook' }),
      icon: <Outlook className={iconStyle} />,
      onClick: () => openExternalWindow(getMailLink(link)),
    },
    ...defaultEmailOptions,
  ];
};
