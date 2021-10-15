import { IpcRenderer } from "electron";

export const isElectron = navigator.userAgent.includes("Electron");

export const ipcRenderer: IpcRenderer | undefined = isElectron
  ? window.require("electron").ipcRenderer
  : undefined;

export const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
class IpcCommunication {
  loops: Map<string, undefined | ((...args: any[]) => void)>;

  constructor() {
    this.loops = new Map();

    this.registerIpcListener();
  }

  private registerIpcListener() {
    ipcRenderer?.on('asynchronous-reply', (evt, replay) => {
      if (replay.eventId && this.loops.has(replay.eventId)) {
        this.loops.get(replay.eventId)?.(replay.data);

        if (!replay.keepalive) {
          this.loops.delete(replay.eventId);
        }
      }
    })
  }

  emit({ type, extraMap, callback }: {
    type: string;
    extraMap: Record<string, any>;
    callback?: (...args: any[]) => void;
  }) {
    const evtId = uuid();

    ipcRenderer?.send('asynchronous-message', {
      type,
      extraMap,
      eventId: evtId,
    })

    this.loops.set(evtId, callback)
  }
}

export const ipcCommunication = new IpcCommunication();
