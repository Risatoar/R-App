/* eslint-disable no-loop-func */
const iohook = require("iohook");
const robotjs = require("robotjs");
const { Notification } = require("electron");

const onMHAutoPutAway = (
  {
    data = [],
    productInitialOffset,
    productSize,
    priceInputOffset,
    confirmBtnOffset,
  },
  cb
) => {
  if (data.length > 0) {
    robotjs.setMouseDelay(200);

    let idx = 0;

    cb({ totalProgress: data.length * 6 }, { keepalive: true });

    for (const pro of data) {
      const { index, price } = pro;

      const progressResp = (progress, message) => {
        cb(
          {
            targetIdx: idx,
            target: pro,
            childProgress: progress,
            totalChildProgress: 6,
            message,
          },
          { keepalive: true }
        );
      };

      const col = Math.floor(index / 5);
      const rowIdx = ((index + 1) % 5 === 0 ? 5 : (index + 1) % 5) - 1;

      const x = (rowIdx + 0.5) * productSize[0] + productInitialOffset[0];
      const y = (col + 0.5) * productSize[1] + productInitialOffset[1];

      progressResp(
        0,
        `当前正在操作商品 ${index}，对应坐标：x - ${x}，y - ${y}`
      );

      robotjs.moveMouse(x, y);

      console.log(`当前正在操作商品 ${index}，对应坐标：x - ${x}，y - ${y}`);

      progressResp(1, "点击商品");

      robotjs.mouseClick();

      console.log("点击商品");

      progressResp(2, "移动鼠标到价格输入框");

      robotjs.moveMouse(priceInputOffset[0], priceInputOffset[1]);

      console.log("移动鼠标到价格输入框");

      progressResp(3, "选中价格输入框");

      robotjs.mouseClick();

      console.log("选中价格输入框");

      progressResp(4, "输入价格");

      robotjs.typeString(price);

      console.log("输入价格");

      progressResp(5, "移动鼠标到上架按钮");

      robotjs.moveMouse(confirmBtnOffset[0], confirmBtnOffset[1]);

      console.log("移动鼠标到上架按钮");

      progressResp(6, "上架");

      robotjs.mouseClick();

      console.log("上架\n");

      idx++;
    }

    cb({ finish: true });
  }
};

const onMHAreaSelect = (area, callback) => {
  if (area === "package") {
    let res = [];
    let canNotice = true;

    const notice = new Notification({
      title: "请选择背包坐标",
      body: "需要点击背包左上角和右下角",
    });

    notice.show();

    iohook.on("mouseclick", (evt) => {
      if (res.length < 2) {
        if (res.length === 0) {
          notice.title = "请点击右下角坐标";
          notice.body = `已选择左上角坐标：x: ${evt.x}, y: ${evt.y}`;
          notice.show();
        }
        res.push({ x: evt.x, y: evt.y });
      }

      if (res.length >= 2) {
        if (canNotice) {
          notice.title = "选择成功";
          notice.body = `左上角坐标：x: ${res[0].x}, y: ${res[0].y}\n左上角坐标：x: ${res[1].x}, y: ${res[1].y}`;
          notice.show();
          canNotice = false;
        }
        callback(res);
      }
    });

    iohook.start();
  } else {
    let hasRes = false;
    iohook.on("mouseclick", (evt) => {
      if (!hasRes) {
        hasRes = true;
        callback({ x: evt.x, y: evt.y });
      }
    });
  }
};

module.exports = {
  onMHAutoPutAway,
  onMHAreaSelect,
};
