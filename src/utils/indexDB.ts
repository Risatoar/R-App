export interface IndexDBProps {
  database: string;
}

class IDB {
  db: IDBObjectStore | null;

  constructor(props: IndexDBProps) {
    this.db = null;

    this.open(props.database);
  }

  open(database: string) {
    const request = window.indexedDB.open(database);
    request.onsuccess = (evt) => {
      this.db = evt.target as unknown as IDBObjectStore;
    };
  }
}

export default IDB;
