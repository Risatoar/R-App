import { IpcRenderer } from 'electron';

export const isElectron = navigator.userAgent.includes('Electron');

export const ipcRenderer: IpcRenderer | undefined = isElectron
  ? window.require('electron').ipcRenderer
  : undefined;

export const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
