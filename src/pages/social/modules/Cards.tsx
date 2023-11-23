import { WebviewWindow } from "@tauri-apps/api/window";
import { Card, Avatar } from "antd";

type Iprops = {
  data: Article[];
};

const Cards = (props: Iprops) => {
  const { data } = props;

  return (
    <div className="cards">
      {data?.map((e) => {
        const st = e.article.indexOf("https://qingbing.top/");
        let imgUrl = "";
        if (st !== -1) {
          const ed = e.article.indexOf(")", st);
          imgUrl = e.article.substring(st, ed);
        }

        return (
          <div
            key={e.id}
            className="card"
            onClick={() => {
              new WebviewWindow("pre_view", {
                url: `/social/preview?id=${e.id}`,
                width: 1400,
                height: 700,
                title: "preview",
              });
            }}
          >
            <Card>
              <div className="card-content">
                <div className="left">
                  <div className="avatar">
                    <Avatar
                      style={{ objectFit: "cover" }}
                      src={e.authorAvatar || ""}
                    />
                    <span>{e.authorName}</span>
                  </div>
                  <div className="title">
                    <p>{e.title}</p>
                    <span>
                      {e.article.substring(0, 80) +
                        `${e.article.length > 80 ? "..." : ""}`}
                    </span>
                  </div>
                </div>
                {imgUrl && <img src={imgUrl} className="card-img" />}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
