export interface CommentModel {
  id?: string;
  commentDate: number;
  commentContent: string;
  socialid: string;
  owner: string;
  interested?: {
    [key: string]: boolean;
  };
  upvote?: {
    [key: string]: boolean;
  };
  downvote?: {
    [key: string]: boolean;
  };
}
