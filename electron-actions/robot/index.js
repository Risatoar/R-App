const { onMHAutoSpeak } = require("./game/mh-auto-speak");
const { onMHAutoPutAway, onMHAreaSelect } = require("./game/mh-auto-put-away");

const onKeyboardAutoActionStart = (args, cb) => {
  switch (args.type) {
    case "mh-auto-speak":
      onMHAutoSpeak(args.message);
      break;

    case "mh-auto-put-away":
      onMHAutoPutAway(args.data, cb);
      break;

    case "mh-auto-area-select":
      onMHAreaSelect(args.area, cb);
      break;

    default:
      break;
  }
};

module.exports = onKeyboardAutoActionStart;
