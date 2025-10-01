import { Dispatch, SetStateAction } from 'react';

export type SetState<T> = Dispatch<SetStateAction<T>>;
export type IconType = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & { title?: string }
>;
export type Timeout = ReturnType<typeof setTimeout>;
export type Interval = ReturnType<typeof setInterval>;

export type RoomTopicEventContent = {
  topic: string | null;
};

export type RoomMetadataContent = {
  description?: string | null;
};

export type RoomSecretEventContent = { roomSecret: string };

type KeysOfTypeNoUndef<T, V> = Exclude<
  {
    [K in keyof T]: NonNullable<T[K]> extends V ? K : never;
  }[keyof T],
  undefined
>;

export type PickByValue<T, V> = Pick<T, KeysOfTypeNoUndef<T, V>>;
