import { Mapper } from '@common/infra/Mapper';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';

export class DiscussionMapper implements Mapper<Discussion> {
  toPersistense(data: Discussion) {
    data;
    throw new Error('Method not implemented.');
  }
  toDomain(data: any): Discussion {
    data;
    throw new Error('Method not implemented.');
  }
  toDTO(data: Discussion): DiscussionDTO {
    return new DiscussionDTO({
      id: data.props.id,
      authorId: data.props.authorId,
      comments: data.props.comments,
      createdAt: data.props.createdAt,
      description: data.props.description,
      downvotes: data.props.downvotes,
      title: data.props.title,
      upvotes: data.props.upvotes,
      resolution: data.props.resolution,
    });
  }
}

export class DiscussionDTO {
  title: string;
  description: string;
  authorId: string;
  createdAt: Date;
  comments: Comment[];
  upvotes: number;
  downvotes: number;
  resolution?: string;
  id?: string;
  constructor(props: DiscussionDTO) {
    Object.entries(props).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
  }
}
