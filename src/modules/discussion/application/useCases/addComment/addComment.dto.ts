export class AddCommentDTO {
  discussionId: string;
  parentCommentId?: string;
  content: string;
}
