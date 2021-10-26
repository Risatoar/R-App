declare namespace game_mh_auto_speak {
    export interface AutoSpeakModel {
        id: string;
        name?: string;
        template?: string;
        dependency?: string[];
        createAt?: number;
        updateAt?: number;
        jobConfig?: JobConfig;
    }

    export type AutoSpeakDataSource = AutoSpeakModel[]
}