import { atom } from 'recoil';
import { DataStoreInstance, DataStoreProps } from '.';
import RDB from '.';

const createDBState = <T extends any[]>(stateKey: string, config: DataStoreProps<T>) => {
  const db = new RDB<T>(config);

  return atom<DataStoreInstance & any | undefined>({
    key: stateKey,
    default: db
  });
}

export default createDBState;