declare global {
  import { IpcRenderer } from 'electron';

  interface Window {
    ipcRenderer: IpcRenderer;
  }
}
