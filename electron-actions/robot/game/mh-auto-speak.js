const chalk = require("chalk");
const robotjs = require("robotjs");

const onMHAutoSpeak = (message) => {
  console.log(chalk.greenBright("自动喊话开始，内容为: "), chalk.red(message));
  robotjs.typeString(message);
  robotjs.keyTap("enter");
};

module.exports = {
  onMHAutoSpeak,
};
