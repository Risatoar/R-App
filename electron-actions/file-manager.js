const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { isFileExistOrCreate } = require("./utils/file");

const dirname = path.resolve(__dirname).replace("electron-actions", "");

const fileWriter = ({ dirPath, filename, data }) => {
  isFileExistOrCreate({ dirPath, filename });

  const resolvePath = path.resolve(dirname, dirPath, filename);

  console.log(
    chalk.bgGreen(chalk.whiteBright("本地文件写入成功\n")),
    chalk.whiteBright(`文件path：${resolvePath} \n`),
    chalk.whiteBright(`写入时间：${new Date().toLocaleString()} \n`)
  );

  fs.writeFileSync(resolvePath, data, "utf-8");
};

const fileReader = ({ dirPath, filename }) => {
  try {
    isFileExistOrCreate({ dirPath, filename });

    const resolvePath = path.resolve(dirname, dirPath, filename);

    const res = fs.readFileSync(resolvePath, "utf-8");

    console.log(
      chalk.bgGreen(chalk.whiteBright("本地文件读取成功\n")),
      chalk.whiteBright(`文件path：${resolvePath} \n`),
      chalk.whiteBright(`读取时间：${new Date().toLocaleString()} \n`)
    );

    return res;
  } catch (error) {
    return "";
  }
};

const fileUploader = ({ name, path: filePath, storeKey }) => {
  if (!fs.existsSync(path.resolve(dirname, "data/file"))) {
    fs.mkdirSync(path.resolve(dirname, "data/file"));
  }

  let copyFileName = name.split(".");

  copyFileName[0] = storeKey;

  copyFileName = copyFileName.join(".");

  const storePath = path.resolve(dirname, "data/file", copyFileName);

  fs.copyFileSync(filePath, storePath);

  const res = "file://" + path.resolve(dirname, "data/file", copyFileName);

  console.log(
    chalk.bgGreen(chalk.whiteBright("上传文件成功\n")),
    chalk.whiteBright(`文件 storeKey：${storeKey} \n`),
    chalk.whiteBright(`上传时间：${new Date().toLocaleString()} \n`)
  );

  return res;
};

const deleteFile = ({ storeKey, isCache }) => {
  storeKey.forEach((key) => {
    const files = fs.readdirSync(path.resolve(dirname, "data/file"));

    const targetFile = files.find((filename) => filename.includes(key));

    if (targetFile) {
      fs.unlinkSync(path.resolve(dirname, "data/file", targetFile));

      console.log(
        chalk.bgGreen(chalk.whiteBright("文件删除成功\n")),
        chalk.whiteBright(`文件：${targetFile} \n`),
        chalk.whiteBright(`删除时间：${new Date().toLocaleString()} \n`),
        chalk.whiteBright(`删除原因：${isCache ? "缓存过期" : "人为删除"} \n`)
      );
    }
  });
};

module.exports = {
  fileWriter,
  fileReader,
  fileUploader,
  deleteFile,
};
