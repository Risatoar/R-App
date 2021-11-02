const iohook = require("iohook");
const { fromEventPattern, scan, takeWhile, map, first, last, tap, take } = require("rxjs");

const getIoHookStream = (eventName = "mouseclick") => {
  return fromEventPattern(
    (handler) => {
      iohook.on(eventName, handler);
      iohook.start();
    },
    (handler) => {
      iohook.off(eventName, handler);
    }
  );
};

const makeAxisStreamByDoubleClick = () => {
  const $click = getIoHookStream();

  const $capture = $click.pipe(
    scan((acc, value) => [...acc, { x: value.x, y: value.y }], []),
    take(2),
    last(),
  );

  return $capture;
};

const makeAxisStreamByClick = () => {
  const $click = getIoHookStream();

  const $capture = $click.pipe(
    first(),
    map((x) => ({
      x: x.x,
      y: x.y,
    }))
  );

  return $capture;
};

const getAxisStream = (type) => {
  switch (type) {
    case "doubleClick":
      return makeAxisStreamByDoubleClick();
    case "click":
      return makeAxisStreamByClick();
    default:
      return null;
  }
};

module.exports = getAxisStream;
