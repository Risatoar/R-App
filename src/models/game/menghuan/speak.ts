import { atom } from "recoil";
import createDBState from "@/datastore/createDBState";

export const autoSpeakState = atom<game_mh_auto_speak.AutoSpeakDataSource>({
  key: "game_mh_auto_speak_data_state",
  default: [],
});

export const dbState = createDBState<game_mh_auto_speak.AutoSpeakDataSource>(
  "game_mh_auto_speak_db_state",
  {
    dirPath: "mh",
    filename: "auto_speak.json",
    initialValue: [],
  }
);
