import { Http } from "..";

const request = new Http({
  baseURL: "https://api.jijinhao.com",
});

// 获取当前价格情况
export const getTodayStatistic = (req: { codes: string; _: number }) =>
  request.get("/quoteCenter/realTime.htm", req);

// 获取日内分时
export const getDataByToday = () =>
  request.get(
    "/sQuoteCenter/todayMin.htm?code=JO_9754",
    {},
    {
      headers: {
        Referer: "https://quote.cngold.org/",
      },
      useNode: true,
    }
  );

// // 获取历史数据
// export const getAllData = () => request.get()
