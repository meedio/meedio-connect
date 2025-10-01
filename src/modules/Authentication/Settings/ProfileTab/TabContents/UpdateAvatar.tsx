import Avatar from '@shared/components/Avatar/Avatar';
import Button from '@shared/components/Button/Button';
import cx from 'classnames';
import { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import Spinner from 'components/Spinner/Spinner';
import useMatrixContext from 'contexts/MatrixContext/useMatrixContext';
import useMatrixAvatar from 'modules/Authentication/hooks/useMatrixAvatar';
import useMxCookies from 'modules/Authentication/hooks/useMxCookies';
import SettingsCard from 'modules/SettingsModal/SettingsCard/SettingsCard';

/**
 * Update avatar image for the user
 * @returns The component if user is logged in
 */
const UpdateAvatar = () => {
  const { t } = useTranslation();
  const { mxDisplayName } = useMxCookies();
  const { matrixClient, mxAvatarUrl, setMxAvatarUrl } = useMatrixContext();
  const { changeAvatar, clearAvatar, loading } = useMatrixAvatar(matrixClient, setMxAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles[0]) return;
    const [file] = acceptedFiles;
    const event = { target: { files: [file] } };
    await changeAvatar(event as unknown as React.ChangeEvent<HTMLInputElement>);
  };
  const { getRootProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1, noClick: true });

  return (
    <SettingsCard.Content>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <SettingsCard.Content.Title>{t('profile_picture')}</SettingsCard.Content.Title>
          <SettingsCard.Content.Description>{t('profile_picture_explanation')}</SettingsCard.Content.Description>
        </div>
        <div className="flex">
          <div
            {...getRootProps()}
            className={cx(
              'relative w-20 h-20 rounded-2xl transition-all duration-200 border-2 border-dashed border-transparent box-content',
              {
                '!border-green-500': isDragActive,
              }
            )}
          >
            {loading && <Spinner className="absolute m-auto inset-0 z-10" />}
            {mxAvatarUrl ? (
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-sm shadow-gray-40 cursor-default select-none drag-none"
                src={mxAvatarUrl}
                alt="avatar"
                draggable={false}
              />
            ) : (
              <Avatar size="lg" name={mxDisplayName} />
            )}
          </div>
          <div className="flex flex-col items-start justify-between ml-3 sm:ml-0 sm:flex-row sm:items-end">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              key={mxAvatarUrl}
              onChange={changeAvatar}
            />
            <div className="sm:flex">
              <Button
                variant="secondaryTertiary"
                size="sm"
                className="h-10 sm:mx-3 px-4 p-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {t('edit_image')}
              </Button>
              <Button
                variant="secondaryTertiary"
                size="sm"
                className={cx('h-10 p-2 mt-1 px-4 sm:mt-0', {
                  '!text-alert-50': mxAvatarUrl && !loading,
                })}
                onClick={clearAvatar}
                disabled={!mxAvatarUrl || loading}
              >
                {t('remove')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard.Content>
  );
};

export default UpdateAvatar;
