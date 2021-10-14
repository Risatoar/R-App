import { uuid, ipcRenderer } from '.';

export interface FileReaderProps {
  filename: string;
  dirPath: string;
  defaultValue: string;
}

class FileReader {
  eventId: string;
  filename: string;
  dirPath: string;
  defaultValue: string;

  constructor(props: FileReaderProps) {
    this.eventId = uuid();
    this.dirPath = props.dirPath;
    this.filename = props.filename;
    this.defaultValue = props.defaultValue;
  }

  on(callback?: (data: string) => void) {
    ipcRenderer?.on('asynchronous-reply', (evt, args) => {
      if (args.eventId === this.eventId && args.type === 'file-read') {
        if (args?.data) {
          callback?.(args.data);
        } else {
          this.write(this.defaultValue);
        }
      }
    });
  }

  write(data: string) {
    ipcRenderer?.send('asynchronous-message', {
      type: 'file-write',
      extraMap: {
        dirPath: `data/${this.dirPath}`,
        filename: this.filename,
        data,
      },
      eventId: this.eventId,
    });
  }

  read() {
    ipcRenderer?.send('asynchronous-message', {
      type: 'file-read',
      extraMap: {
        dirPath: `data/${this.dirPath}`,
        filename: this.filename,
      },
      eventId: this.eventId,
    });
  }
}

export default FileReader;
