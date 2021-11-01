import { IpcRenderer } from "electron";
import { fromEventPattern, takeWhile, scan, map } from "rxjs";

export const isElectron = navigator.userAgent.includes("Electron");

export const ipcRenderer: IpcRenderer | undefined = isElectron
  ? window.require("electron").ipcRenderer
  : undefined;

export const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

export const ipcObserver = ({
  type,
  extraMap,
  eventId,
}: {
  type: string;
  eventId?: string;
  extraMap: Record<string, any>;
}) => {
  const evtId = eventId || uuid();

  const $replyStream = fromEventPattern(
    (handler) => {
      ipcRenderer?.on("asynchronous-reply", handler);
    },
    (handler) => {
      ipcRenderer?.off("asynchronous-reply", handler);
    }
  );

  ipcRenderer?.send("asynchronous-message", {
    type,
    extraMap,
    eventId: evtId,
  });

  const $reply = $replyStream.pipe(
    scan(
      (acc, x, index) => ({
        index,
        data: x as any,
      }),
      { index: 0, data: undefined }
    ),
    takeWhile(({ index, data }) => {
      if ((data as unknown as any[])[1]?.eventId !== evtId) {
        return false;
      }

      const resp = (data as unknown as any[])[1];

      if ((resp?.data as any)?.keepalive) {
        return true;
      }
      return index < 1;
    }),
    map((x: any) => x.data[1].data)
  );

  return $reply;
};