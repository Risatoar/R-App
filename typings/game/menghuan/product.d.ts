declare namespace game_mh_product {
  export interface Product {
    id?: string;
    name?: string;
    coverImage?: string;
    price?: string;
    tags?: string[];
    createAt?: number;
    lastSelectedAt?: number;
  }

  export interface ProductPanel {
    id?: string;
    name?: string;
    data?: Product[];
  }

  export interface ProductTab {
    id?: string;
    name?: string;
    activeTab?: string[];
    data?: ProductPanel[];
  }

  export type ProductDataSource = ProductTab[];
}
