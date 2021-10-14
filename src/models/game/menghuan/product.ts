import { atom } from 'recoil';
import createDBState from '@/datastore/createDBState';

export const productState = atom<game_mh_product.ProductDataSource>({
  key: 'all',
  default: [],
});

export const dbState = createDBState<game_mh_product.ProductDataSource>('game_mh_db_state', {
  dirPath: 'menghuan',
  filename: 'product.json',
  initialValue: []
})