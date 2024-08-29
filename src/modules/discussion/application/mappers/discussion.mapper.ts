import { Mapper } from '@common/infra/Mapper';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';

export class DiscussionMapper implements Mapper<Discussion> {
  toPersistense(data: Discussion) {
    return {
      id: data.props.id,
      title: data.props.title,
      description: data.props.description,
      authorId: data.props.authorId,
      comments: data.props.comments,
      upvotes: data.props.upvotes,
      downvotes: data.props.downvotes,
      resolution: data.props.resolution,
    };
  }
  toDomain(data: DiscussionMapperToDomain): Discussion {
    return Discussion.create({
      authorId: data.authorId,
      description: data.description,
      title: data.title,
      comments: [],
      createdAt: data.createdAt,
      downvotes: data.downvotes,
      id: data.id,
      resolution: data.resolution,
      updatedAt: data.updatedAt,
      upvotes: data.upvotes,
    }).value as Discussion;
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

export type DiscussionMapperToDomain = {
  id: string;
  authorId: string;
  description: string;
  title: string;
  comments: [];
  createdAt: Date;
  downvotes: number;
  upvotes: number;
  resolution: string;
  updatedAt: Date;
};

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
