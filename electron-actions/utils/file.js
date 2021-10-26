const fs = require("fs");
const path = require("path");

const isFileExistOrCreate = ({ dirPath, filename }) => {
  const resolvePath = path.resolve(__dirname, dirPath, filename);

  const file = fs.existsSync(resolvePath);

  if (!file) {
    const dir = dirPath.split("/");
    for (let i = 0; i < dir.length; i++) {
      const dirItemPath = path.resolve(__dirname, ...dir.slice(0, i + 1));

      if (!fs.existsSync(dirItemPath)) {
        fs.mkdirSync(dirItemPath);
      }
    }

    fs.writeFileSync(resolvePath, "", "utf-8");
  }
};

module.exports = {
  isFileExistOrCreate
};
