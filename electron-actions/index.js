const { ipcMain } = require("electron");
const {
  fileReader,
  fileWriter,
  fileUploader,
  deleteFile,
} = require("./file-manager");
const onKeyboardAutoActionStart = require("./robot");
const getAxisByManual = require('./utils/manual-axis');

const registerMainIpc = () => {
  getAxisByManual('doubleClick');
  ipcMain.on("asynchronous-message", (evt, args) => {
    const { type, extraMap, eventId } = args;

    switch (type) {
      case "file-read":
        evt.sender.send("asynchronous-reply", {
          type: "file-read",
          data: fileReader(extraMap),
          eventId,
        });
        break;

      case "file-write":
        fileWriter(extraMap);
        evt.sender.send("asynchronous-reply", {
          type: "file-read",
          data: fileReader(extraMap),
          eventId,
        });
        break;

      case "auto-keyboard":
        const cb = (res, config) => {
          evt.sender.send("asynchronous-reply", {
            type,
            data: res,
            eventId,
            ...config,
          });
        };
        onKeyboardAutoActionStart(extraMap, cb);
        break;

      case "upload-file":
        evt.sender.send("asynchronous-reply", {
          type: "upload-file",
          data: fileUploader(extraMap),
          eventId,
        });
        break;

      case "file-delete":
        deleteFile(extraMap);
        break;

      default:
        break;
    }
  });
};

module.exports = registerMainIpc;
