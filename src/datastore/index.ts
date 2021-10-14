import _, { cloneDeep, merge, orderBy } from 'lodash';
/* eslint-disable no-loop-func */
import FileReader, { FileReaderProps } from '@/utils/file-reader';

export interface DataStoreProps<T extends any[]> extends Omit<FileReaderProps, 'defaultValue'> {
  initialValue: T,
}

export interface DataStoreInstance {
  onDataChange: (callback: (data: any) => void) => void;
  query: (config: QueryConfig, modify?: ModifyConfig) => void;
  add: (config: UpdateConfig, value: any) => void;
  update: (config: UpdateConfig, value: any) => void;
  remove: (config: UpdateConfig) => void;
}

type QueryConfig = {
  where?: '*' | string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'asc' | "desc";
}

type ModifyConfig = {
  updateValue?: any;
  addValue?: any;
  remove?: boolean;
}

type UpdateConfig = {
  where?: string;
};

export default class RStore<T extends any[]> {
  private fileReader: any;
  private db: T;
  private dbChangeListener?: (data: any) => void;

  constructor(props: DataStoreProps<T>) {
    this.create(props);

    this.db = [] as unknown as T;
  }


  private create({ filename, dirPath, initialValue }: { filename: string, dirPath: string, initialValue: T }) {
    this.fileReader = new FileReader({
      dirPath,
      filename,
      defaultValue: JSON.stringify(initialValue)
    });

    this.fileReader?.read();

    this.fileReader?.on((data: string) => {
      this.db = JSON.parse(data) || [];
      this.dbChangeListener?.(this.db);
    })
  }

  private updateDataSource(value: any) {
    this.db = value;

    this.fileReader?.write(JSON.stringify(this.db))
  }

  public onDataChange(callback: (data: any) => void) {
    this.dbChangeListener = callback;
  }

  public query(config: QueryConfig, modify?: ModifyConfig) {
    let queryTarget: _.List<any> | null | undefined = [];
    const dataSource = cloneDeep(this.db);
    let parent = dataSource;

    if (config.where === '*') {
      queryTarget = dataSource;
    } else {
      const searchPaths = config.where?.split('.');

      let idx = 0;
      let cursor = dataSource;

      while (idx < searchPaths?.length!) {
        let target = cursor.find(({ id }) => id === searchPaths?.[idx]);

        parent = cursor;

        if (!Array.isArray(target?.data)) {
          cursor = target;
          break;
        }

        if (Array.isArray(target?.data)) {
          cursor = target.data;
        }

        if (cursor) {
          idx++;
        } else {
          break;
        }
      }

      queryTarget = cursor;
    }

    if (!Array.isArray(queryTarget)) {
      if (modify?.remove) {
        const targetIdx = parent.findIndex(({ id }) => id === (queryTarget as any).id)
        
        if (targetIdx !== -1) {
          parent.splice(targetIdx, 1);
        }

        this.updateDataSource(dataSource);
      } else if (modify?.updateValue) {
        merge(queryTarget, modify?.updateValue);
        this.updateDataSource(dataSource);
      }
      return queryTarget;
    }

    if (modify?.addValue) {
      (Array.isArray(queryTarget) ? queryTarget : parent).push(modify?.addValue);

      this.updateDataSource(dataSource);
      return;
    }

    if (config.orderBy) {
      orderBy(queryTarget, config.orderBy, config.order);
    }

    if (config.limit) {
      queryTarget = (queryTarget as any[]).slice(config?.offset || 0, config?.limit);
    }

    return queryTarget;
  }

  public add(config: UpdateConfig, value: any) {
    this.query(config, { addValue: value })
  }

  public update(config: UpdateConfig, value: any) {
    this.query(config, { updateValue: value });
  }

  public remove(config: UpdateConfig) {
    this.query(config, { remove: true })
  }
}