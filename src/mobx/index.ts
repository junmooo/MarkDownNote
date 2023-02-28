import { makeAutoObservable } from "mobx";

class Store {
  userInfo: UserInfo = {
    name: "",
  };
  setUserInfo(info: UserInfo) {
    this.userInfo = info;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

const StoreInstance = new Store();
export default StoreInstance;
