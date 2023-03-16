import { ErrMsg } from "@/types/common";
import { makeAutoObservable } from "mobx";

class Store {
  currentArticle: string = "# ssssssss15ds4a561ad65156";

  setCurrentArticle(article: string) {
    this.currentArticle = article;
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

  theme = "smart-blue";

  nextTheme() {
    const themes = [
      "default",
      "github",
      "vuepress",
      "mk-cute",
      "smart-blue",
      "cyanosis",
    ];
    for (let i = 0; i < themes.length; i++) {
      if (themes[i] === this.theme) {
        if (i < themes.length - 1) {
          this.theme = themes[i + 1];
          return;
        } else {
          this.theme = themes[0];
          return;
        }
      }
    }
  }

  constructor() {
    makeAutoObservable(this);
  }
}

const StoreInstance = new Store();
export default StoreInstance;
