import { nodeFetch } from "@/utils";
import { message } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface FetchBaseConfig {
  baseURL?: string;
  errorMsg?: string;
  headers?: Record<string, string>;
  useNode?: boolean;
}

export class Http {
  private axiosInstance: AxiosInstance = axios;
  private config: FetchBaseConfig;

  constructor(config: FetchBaseConfig) {
    const { baseURL = "", headers, errorMsg } = config;

    this.config = config;

    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Accept: "application/json",
        ...headers,
      },
    });

    this.axiosInstance.interceptors.response.use(
      (data) => data.data,
      (error) => {
        const msg = errorMsg || "网络错误";

        message.error(msg);

        return Promise.reject(new Error(msg));
      }
    );
  }

  private async fetch<Req extends Record<string, any>, Resp = any>({
    config = {},
    data,
    method = "POST",
    url,
  }: {
    config?: AxiosRequestConfig & { manual?: boolean; useNode?: boolean };
    data?: Req;
    method: "GET" | "POST";
    url: string;
    errorMsg?: string;
    useNode?: boolean;
  }) {
    const { headers, baseURL, useNode } = { ...this.config, ...config };
    if (useNode) {
      return nodeFetch({ data, method, url, headers, baseUrl: baseURL! });
    }

    const resp = await this.axiosInstance.request<Req, any>({
      ...config,
      data: method === "POST" ? data : undefined,
      method,
      params: method === "GET" ? data : undefined,
      url,
    });

    return resp as Resp;
  }

  get(path: string, data?: any, config?: FetchBaseConfig): Promise<any> {
    const { errorMsg } = { ...this.config, ...config };

    return this.fetch({
      config,
      data,
      method: "GET",
      url: path,
      errorMsg,
    });
  }

  post(path: string, data?: any, config?: FetchBaseConfig): Promise<any> {
    const { errorMsg } = { ...this.config, ...config };

    return this.fetch({
      config,
      data,
      method: "POST",
      url: path,
      errorMsg,
    });
  }
}
