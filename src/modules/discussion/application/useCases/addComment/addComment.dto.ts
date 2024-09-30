export type AddCommentDTO = {
  discussionId: string;
  parentCommentId?: string;
  content: string;
};
