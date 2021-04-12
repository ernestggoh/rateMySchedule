export interface CommentModel {
  id?: string;
  commentContent: string;
  socialid: string;
  owner: string;
  interested?: {
    [key: string]: boolean;
  };
  upvote: number;

  
}
