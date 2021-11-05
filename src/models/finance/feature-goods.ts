import { FG_TYPE_ENUM } from "@/constants/feature-goods";
import { atom } from "recoil";

export const tabState = atom({
  key: "finance_feature_goods_tab",
  default: FG_TYPE_ENUM.silver,
});