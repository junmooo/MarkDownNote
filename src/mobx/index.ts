import { ErrMsg } from "@/types/common";
import { makeAutoObservable } from "mobx";

class Store {
  userInfo: UserInfo = {
    name: "",
  };

  setUserInfo(info: UserInfo) {
    this.userInfo = info;
  }

  edit: boolean = true;

  setEditTrue() {
    this.edit = true;
  }

  setEditFalse() {
    this.edit = false;
  }

  errMsg: ErrMsg = {
    show: false,
    type: "error",
    duration: 2,
    content: "失败",
  };

  setErrMsg(params: ErrMsg) {
    this.errMsg = params;
  }

  draft: Article = {
    title: "未命名",
    article: "# HELLO WORLD!",
  };

  setDraft(draft: Article) {
    this.draft = draft;
  }

  token: string = "";

  setToken(token: string) {
    this.token = token;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

const StoreInstance = new Store();
export default StoreInstance;
