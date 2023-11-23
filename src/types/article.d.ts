type Article = {
  id?: string;
  title?: string;
  article: string;
  type?: string;
  comment?: string;
  authorId?: string;
  authorName?: string;
  timeCreated?: string;
  timeUpdated?: string;
  authorAvatar?: string;
};

type ArticleTree = {
  id: string;
  tree: string;
  ownerId: string;
  comment?: string;
  timeCreated?: string;
  timeUpdated?: string;
};
