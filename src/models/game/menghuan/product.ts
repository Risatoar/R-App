import usePersistCallback from "@/hooks/usePersistCallback";
import { atom, useRecoilState } from "recoil";
import createDBState from "@/datastore/createDBState";
import { flatten } from "lodash";

export const productState = atom<game_mh_product.ProductDataSource>({
  key: "game_mh_product_data_state",
  default: [],
});

export const dbState = createDBState<game_mh_product.ProductDataSource>(
  "game_mh_db_state",
  {
    dirPath: "mh",
    filename: "product.json",
    initialValue: [],
  }
);

export const useDbModel = () => {
  const [data] = useRecoilState(productState);

  const getAllProducts = usePersistCallback(() => {
    return flatten((flatten(data.map(({ data }) => data)) as game_mh_product.ProductPanel[]).map(
      ({ data }) => data
    ));
  });

  return {
    getAllProducts,
  };
};
