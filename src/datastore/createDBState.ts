import { atom, RecoilState } from "recoil";
import { DataStoreInstance, DataStoreProps } from ".";
import RDB from ".";

const createDBState = <T extends any[]>(
  stateKey: string,
  config: DataStoreProps<T>
): RecoilState<DataStoreInstance | undefined> => {
  const db = new RDB<T>(config);

  return atom<DataStoreInstance | undefined>({
    key: stateKey,
    default: db,
  });
};

export default createDBState;
