/* eslint-disable no-loop-func */
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import store from "@/mobx";
import { observer } from "mobx-react";
// import "./article.less";
import { WebviewWindow } from "@tauri-apps/api/window";
import { message } from "antd";
interface Iprops {
  // article: Article;
}

const Preview = observer((props: Iprops) => {
  const [messageApi, contextHolder] = message.useMessage();

  const article =
    "# Markdown 简明语法\n" +
    "`Markdown 是一种可以让人专注于内容与代码的轻量级的【标记语言】。让我们离开那些繁琐的排版与样式，专注于内容吧！`\n" +
    "\n" +
    "[https://markdown.com.cn/basic-syntax/](https://markdown.com.cn/basic-syntax/)\n" +
    "\n" +
    "> 点开编辑模式对照查看源码和展示效果\n" +
    "\n" +
    "### 标题\n" +
    "\n" +
    "在 Markdown 中，标题是使用 1-6 个`#` 进行标记，分为六级：`#` 、`##`、`###`…… ，刚好对应 h1~h6:\n" +
    "\n" +
    "# 一级标题\n" +
    "\n" +
    "## 二级标题\n" +
    "\n" +
    "### 三级标题\n" +
    "\n" +
    "#### 四级标题\n" +
    "\n" +
    "##### 五级标题\n" +
    "\n" +
    "###### 六级标题\n" +
    "\n" +
    "### 区块与段落\n" +
    "\n" +
    "区块则是使用 `>` 来进行标记：\n" +
    "\n" +
    "> 这是一个区块啊！！！！\n" +
    "\n" +
    "可以通过首尾个空一行来形成一个段落，也就是类似于在 HTML 中以 `<p>`标签包起来：（注：官方语法推荐在标记的后面加入一个空格）\n" +
    "\n" +
    "这是一个段落啊！我被`<p>`包住啦！\n" +
    "\n" +
    "```html\n" +
    "<!--这是一段html代码 -->\n" +
    "<!DOCTYPE html>\n" +
    '<html lang="en">\n' +
    "  <head>\n" +
    '    <meta charset="UTF-8" />\n' +
    '    <link rel="icon" type="image/svg+xml" href="/vite.svg" />\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
    "    <title>Tauri + React + TS</title>\n" +
    "  </head>\n" +
    "\n" +
    "  <body>\n" +
    '    <div id="root"></div>\n' +
    '    <script type="module" src="/src/main.tsx"></script>\n' +
    "  </body>\n" +
    "</html>\n" +
    "\n" +
    "```\n" +
    "\n" +
    "```java\n" +
    "// 这是一段java代码\n" +
    "public static void main(String[] args) {\n" +
    '    System.out.println("HELLO WORLD!");\n' +
    "}\n" +
    "```\n" +
    "\n" +
    "### 有序列表与无序列表\n" +
    "\n" +
    "学过 HTML 的同学一定知道 `<li>和<ol>`,而在 MD 中，无序列表可以用 `*/+/-`来进行标注：（通过行首加入 tab，可标记二级列表）\n" +
    "\n" +
    "> - 苹果\n" +
    "> - 梨子\n" +
    "\n" +
    "- 运动\n" +
    "  - 篮球\n" +
    "  - 乒乓球\n" +
    "\n" +
    "而有序列表则直接使用数字进行标记：\n" +
    "\n" +
    "> 1.  冠军\n" +
    "> 2.  亚军\n" +
    "> 3.  季军\n" +
    "\n" +
    "### 强调\n" +
    "\n" +
    "输出为 HTML 中的 `<strong>\\<em>`，使用 `*`和`**`包住强调的部分：\n" +
    "\n" +
    "> 你好！我是一个 _强调_ 哦！！\n" +
    "> 你好！我是一个比你还厉害的二级 **强调** 哦！\n" +
    "\n" +
    "### 链接\n" +
    "\n" +
    "输出为 HTML 中的 `<a>`标签，使用 `[]`直接包裹链接部分，后直接跟上`()`填入链接到的地址（也可以在地址后面 空格+title）：\n" +
    "\n" +
    '> 你好！我叫小百 [我的家](www.baidu.com "这里是title哦！")；\n' +
    "\n" +
    "### 图片\n" +
    "\n" +
    "输出为 HTML 中的 `<img>`标签，用法与标记链接基本一致：\n" +
    "\n" +
    "> 这是一张图片 ![图片](https://qingbing.top/imgs/fa6af4a1-09ae-4c2c-a822-d56a216717f3.jpeg)\n" +
    "\n" +
    "### 代码块\n" +
    "\n" +
    "当你需要在文章中添加代码时，比如 `<p>hello world</p>` ，如果直接输入，则会变成\n" +
    "\n" +
    "> <p>hello world</p>\n" +
    "\n" +
    "p 标签被直接翻译吃掉啦！因此，我们需要对代码块进行特殊的标识：\n" +
    "\n" +
    "- 行内代码块： 使用反引号进行包裹：\n" +
    "\n" +
    "  > `<p>hello world</p>`\n" +
    "\n" +
    "- 块状代码块：使用 tab 对整体代码进行缩进；\n" +
    "\n" +
    "      <p>hello world</p>\n" +
    "\n" +
    "### 表格\n" +
    "\n" +
    "MD 的表格有点好玩，其实就是使用 `|`画出一个表格来，但其实这有点小麻烦：\n" +
    "\n" +
    "> | Item       |    Value | Qty |\n" +
    "> | :------- | -------: | :-: |\n" +
    "> | Computer | 1600 USD |  5  |\n" +
    "> | Phone    |   12 USD | 12  |\n" +
    "> | Pipe       |    1 USD | 234 |\n" +
    "\n" +
    "### 饼图\n" +
    "\n" +
    "```mermaid\n" +
    "pie title Pets adopted by volunteers\n" +
    '  "Dogs" : 386\n' +
    '  "Cats" : 85\n' +
    '  "Rats" : 15\n' +
    "```\n" +
    "\n" +
    "### 旅程图\n" +
    "\n" +
    "```mermaid\n" +
    "journey\n" +
    "  title My working day\n" +
    "  section Go to work\n" +
    "    Make tea: 5: Me\n" +
    "    Go upstairs: 3: Me\n" +
    "    Do work: 0: Me, Cat\n" +
    "  section Go home\n" +
    "    Go downstairs: 5: Me\n" +
    "    Sit down: 5: Me\n" +
    "```\n" +
    "\n" +
    "### 小结\n" +
    "\n" +
    "熟练的使用上述的这些规则，应该就能应付平时的日常使用了，除了表格比较麻烦外，其它都简单易用。但需要多多联系，熟能生巧嘛。~在日后写博客的过程中，慢慢的掌握它！加油~~~\n";

  const aOnClick = (e: any) => {
    const url = e.target.href;
    if (url && !url.toLowerCase()?.includes("localhost")) {
      e.preventDefault();
      new WebviewWindow("external_view", {
        url,
        width: 1400,
        height: 700,
        title: "外部链接",
      });
    }
  };

  return (
    <div className="page-ctn">
      <div className="article-ctn" onClick={aOnClick}>
        <MdEditor
          className="editor"
          editorId={"preview"}
          modelValue={article}
          theme="light"
          previewTheme={store.theme}
          previewOnly={true}
        />
      </div>
      {contextHolder}
    </div>
  );
});

export default Preview;
