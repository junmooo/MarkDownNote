import { NoticeType } from "antd/es/message/interface";

export interface AxiosStatic extends AxiosInstance {
  (config: AxiosRequestConfig): Promise<any>;
  create(config?: CreateAxiosDefaults): AxiosInstance;
  Cancel: CancelStatic;
  CancelToken: CancelTokenStatic;
  Axios: typeof Axios;
  AxiosError: typeof AxiosError;
  HttpStatusCode: typeof HttpStatusCode;
  readonly VERSION: string;
  isCancel: typeof isCancel;
  all: typeof all;
  spread: typeof spread;
  isAxiosError: typeof isAxiosError;
  toFormData: typeof toFormData;
  formToJSON: typeof formToJSON;
  CanceledError: typeof CanceledError;
  AxiosHeaders: typeof AxiosHeaders;
}

declare const axios: AxiosStatic;

type ErrMsg = {
  type: NoticeType;
  duration: number;
  content: string;
  show: boolean;
};
