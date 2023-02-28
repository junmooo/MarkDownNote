import { useRef } from "react";
import "./index.less";
type Upload = {
  formats: string[];
  maxSize: number;
  onChange: (files: FileList) => void;
  multiple: boolean;
  onCheck: (msg: string) => void;
  icon?: string;
  iconSize?: string;
  maxCount?: number;
  uploadRef: any;
};

const Upload = (props: Upload) => {
  const myFilebutton = useRef<HTMLInputElement>();
  const {
    onChange = () => {},
    multiple = false,
    onCheck = () => {},
    icon = "",
    iconSize = "20px",
    maxCount = 5,
    uploadRef,
    formats,
    maxSize,
  } = props;
  const beforeUpload = (files: FileList) => {
    if (files.length > maxCount) {
      return false;
    }
    for (let i = 0; i < files.length; i++) {
      const isLt = files[i].size / 1024 / 1024 < maxSize;
      return isLt;
    }
  };

  // 选择一个文件时onchange时间被触发
  const fileSelected = () => {
    const files = myFilebutton?.current?.files;
    if (files && maxCount && maxSize && !beforeUpload(files)) {
      onCheck(`选取文件必须少于${maxCount}个, 且小于${maxSize}MB!`);
      return;
    }
    files && onChange(files);
  };

  return (
    <div>
      <div ref={uploadRef} onClick={() => myFilebutton?.current?.click()}>
        {icon && (
          <img
            src={icon || ""}
            style={{ width: iconSize || "0px" }}
            alt="upload icon"
          />
        )}
      </div>
      <input
        ref={myFilebutton as any}
        type="file"
        multiple={multiple}
        style={{ display: "none" }}
        accept={formats && formats.join(",")}
        onChange={() => fileSelected()}
      />
    </div>
  );
};

export default Upload;
