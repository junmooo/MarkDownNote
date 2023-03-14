import { WebviewWindow } from "@tauri-apps/api/window";
import { Card, Avatar } from "antd";
import moment from "moment";
const { Meta } = Card;

type Iprops = {
  data: Article[];
};

function Cards(props: Iprops) {
  const { data } = props;
  return (
    <div className="cards">
      {data?.map((e) => {
        return (
          <div
            className="card"
            onClick={() => {
              new WebviewWindow("external_view", {
                url: "/social/preview",
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
                    <Avatar src="https://qingbing.top/imgs/0244df0b-eee2-4a9c-b28c-25f50d2a9a7c.png" />
                    <span>{e.authorName}</span>
                  </div>
                  <div className="title">
                    <p>{e.title}</p>
                    <span>{e.article.substring(0, 200) + "..."}</span>
                  </div>
                </div>
                <img src="https://qingbing.top/imgs/0244df0b-eee2-4a9c-b28c-25f50d2a9a7c.png" />
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

export default Cards;
