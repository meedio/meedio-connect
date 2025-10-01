import { useModal } from '@ebay/nice-modal-react';
import { Room } from 'matrix-js-sdk/src';
import { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { SetState } from 'utils/types';
import useCreateNewRoomForm from './useCreateRoomForm';
import {
  AliasStatusEnum,
  getDigitsFromRoomAlias,
  getRandomFourDigitString,
  RoomFormType,
} from './utils';
import { CreateNewRoomStepsEnum } from '../utils';

export interface CreateNewRoomDataContextType {
  currentStep: CreateNewRoomStepsEnum;
  setCurrentStep: SetState<CreateNewRoomStepsEnum>;
  roomForm: UseFormReturn<RoomFormType, undefined>;
  digitsPostfix: string;
  setDigitsPostfix: SetState<string>;
  hasAliasChanged: boolean;
  setHasAliasChanged: SetState<boolean>;
  aliasStatus: AliasStatusEnum;
  setAliasStatus: SetState<AliasStatusEnum>;
  handleExit: () => void;
  roomToEdit?: Room;
}

export const CreateNewRoomDataContext =
  createContext<CreateNewRoomDataContextType | null>(null);

export interface CreateNewRoomDataProviderProps {
  room?: Room;
}

const CreateNewRoomDataProvider = ({
  children,
  room,
}: PropsWithChildren<CreateNewRoomDataProviderProps>) => {
  const { remove } = useModal();
  const [currentStep, setCurrentStep] = useState(
    CreateNewRoomStepsEnum.CREATE_ROOM
  );
  const [hasAliasChanged, setHasAliasChanged] = useState(false);

  const [aliasStatus, setAliasStatus] = useState(AliasStatusEnum.UNKNOWN);

  const roomForm = useCreateNewRoomForm({ room });

  const initialDigits = getDigitsFromRoomAlias(room);
  const [digitsPostfix, setDigitsPostfix] = useState(
    initialDigits ? initialDigits : getRandomFourDigitString()
  );

  const handleExit = useCallback(() => {
    if (!roomForm.formState.isDirty) return remove();
    setCurrentStep(CreateNewRoomStepsEnum.DISCARD);
  }, [remove, roomForm.formState.isDirty]);

  return (
    <CreateNewRoomDataContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        roomForm,
        digitsPostfix,
        setDigitsPostfix,
        hasAliasChanged,
        setHasAliasChanged,
        aliasStatus,
        setAliasStatus,
        handleExit,
        roomToEdit: room,
      }}
    >
      {children}
    </CreateNewRoomDataContext.Provider>
  );
};

export default CreateNewRoomDataProvider;
