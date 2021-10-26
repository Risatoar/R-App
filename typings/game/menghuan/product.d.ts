declare namespace game_mh_product {
  export interface Product {
    id?: string;
    name?: string;
    coverImage?: string;
    similarCoverImages?: string[];
    price?: string;
    tags?: string[];
    createAt?: number;
    updateAt?: number;
    lastSelectedAt?: number;
  }

  export interface ProductPanel {
    id?: string;
    name?: string;
    data?: Product[];
    createAt?: number;
    updateAt?: number;
  }

  export interface ProductTab {
    id?: string;
    name?: string;
    activeTab?: string[];
    data?: ProductPanel[];
    createAt?: number;
    updateAt?: number;
  }

  export type ProductDataSource = ProductTab[];
}
