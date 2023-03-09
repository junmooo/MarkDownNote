import {
  BaseDirectory,
  createDir,
  exists,
  writeTextFile,
} from "@tauri-apps/api/fs";

export const log = (params: any) => console.log(params);

export const exportMdNote = async (title: string, content: string) => {
  if (!(await exists("markdowns", { dir: BaseDirectory.Desktop }))) {
    await createDir("markdowns", {
      dir: BaseDirectory.Desktop,
      recursive: true,
    });
  }
  return writeTextFile(`markdowns/${title}`, content, {
    dir: BaseDirectory.Desktop,
  });
};
