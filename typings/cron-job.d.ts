 declare interface JobConfig {
    /** 定时任务类型 */
    type: "interval" | "once";
    /** 定时任务判定间隔时长 */
    time: number;
    /** 定时持续时长，interval 使用，默认不设置时长 */
    duration?: number;
    /** 定时特定时间点，once 使用 */
    timeTarget?: number;
    /** callback */
    callback: () => void;
  }