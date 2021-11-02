/* eslint-disable no-loop-func */
const robotjs = require("robotjs");
const { Notification } = require("electron");
const getAxisStream = require("../../utils/manual-axis");

// TODO 啥时候有空处理下多线程监听键盘事件禁用，转为多线程流式控制
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

      const progressResp = (progress, message, fn) => {
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

        fn();
      };

      const col = Math.floor(index / 5);
      const rowIdx = ((index + 1) % 5 === 0 ? 5 : (index + 1) % 5) - 1;

      const x = (rowIdx + 0.5) * productSize[0] + productInitialOffset[0];
      const y = (col + 0.5) * productSize[1] + productInitialOffset[1];

      progressResp(
        0,
        `当前正在操作商品 ${index}，对应坐标：x - ${x}，y - ${y}`,
        () => robotjs.moveMouse(x, y)
      );

      progressResp(1, "点击商品", () => robotjs.mouseClick());

      progressResp(2, "移动鼠标到价格输入框", () =>
        robotjs.moveMouse(priceInputOffset[0], priceInputOffset[1])
      );

      progressResp(3, "选中价格输入框", () => robotjs.mouseClick("left", true));

      progressResp(4, "输入价格", () => robotjs.typeString(price));

      progressResp(5, "移动鼠标到上架按钮", () =>
        robotjs.moveMouse(confirmBtnOffset[0], confirmBtnOffset[1])
      );

      progressResp(6, "上架", () => robotjs.mouseClick());

      idx++;
    }

    cb({ finish: true });
  }
};

const onMHAreaSelect = (area, callback) => {
  if (area === "package") {
    const notice = new Notification({
      title: "请选择背包坐标",
      body: "需要点击背包左上角和右下角",
    });

    notice.show();

    getAxisStream("doubleClick").subscribe(callback);
  } else {
    getAxisStream("click").subscribe(callback);
  }
};

module.exports = {
  onMHAutoPutAway,
  onMHAreaSelect,
};
