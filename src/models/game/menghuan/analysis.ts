import { atom } from "recoil";

export const analysisState = atom<
  Array<{
    url: string;
    price: number;
    name: string;
    disabled: boolean;
  }>
>({
  key: "game_mh_analysis_data_state",
  default: [],
});

export const analysisStatusState = atom<"success" | "loading" | "default">({
  key: "game_mh_analysis_status_state",
  default: "default",
});
