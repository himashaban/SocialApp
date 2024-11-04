export type postType = {
  _id: string;
  body: string;
  image?: string;
  user: UserType;
  createdAt: string;
  comments: commentType[];
};
export type UserType = {
  _id: string;
  name: string;
  photo: string;
  gender: string;
  createdAt: string;
  email:string;
};
export type commentType = {
  _id: string;
  content: string;
  post: string;
  createdAt: string;
  commentCreator: UserType;
};
