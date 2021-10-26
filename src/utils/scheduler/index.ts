import { uuid } from "..";
import { interval, scan, tap, Subscription } from "rxjs";

export interface CronJobProps {
  maxScheduleCount?: number;
}

export interface JobInstance extends JobConfig {
  id: string;
  start: () => void;
  remove: () => void;
  stop: () => void;
  restart: () => void;
}

class CronJob {
  maxCount: number;
  private jobQueue: Array<JobInstance>;
  private pendingQueue: Array<JobInstance>;
  private __timerHandler: Map<string, Subscription | undefined>;

  constructor(props?: CronJobProps) {
    this.maxCount = props?.maxScheduleCount || 1000;
    this.pendingQueue = [];
    this.jobQueue = [];
    this.__timerHandler = new Map();

    this.run();
  }

  private run() {}

  private registerJobToQueue(config: JobConfig) {
    const id = uuid();

    const job = {
      ...config,
      id,
      start: () => this.startJob(id, config),
      remove: () => this.removeJob(id),
      stop: () => this.stopJob(id),
      restart: () => this.restartJob(id),
    };

    // TODO 定时任务缓冲池逻辑补充
    if (this.jobQueue.length < this.maxCount) {
      this.jobQueue.push(job);
    } else {
      this.pendingQueue.push(job);
    }

    return job;
  }

  private startJob(id: string, config: JobConfig) {
    if (!this.__timerHandler.has(id)) {
      let timer;

      switch (config.type) {
        case "interval":
          timer = interval(config.time).pipe(
            scan((x) => x + config.time, 0),
            tap((x) => {
              if (config.duration && x < config.duration) {
                this.removeJob(id);
                return;
              }

              config?.callback?.();
            })
          );
          break;

        default:
          break;
      }

      const subscription = timer?.subscribe();

      console.warn(`定时任务注册 -------- id: ${id}   `, config);

      this.__timerHandler.set(id, subscription);
    }
  }

  private removeJob(id: string) {
    if (this.__timerHandler.has(id)) {
      const subscription = this.__timerHandler.get(id);

      subscription?.unsubscribe?.();

      console.warn(`定时任务移除 -------- id: ${id}   `);

      this.__timerHandler.delete(id);
    }
  }

  private stopJob(id: string) {
    if (this.__timerHandler.has(id)) {
    }
  }

  private restartJob(id: string) {
    if (this.__timerHandler.has(id)) {
    }
  }

  register(config: JobConfig) {
    return this.registerJobToQueue(config);
  }
}

const cronJob = new CronJob();

export default cronJob;
