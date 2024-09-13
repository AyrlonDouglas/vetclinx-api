import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { randomUUID } from 'crypto';

export class DiscussionFakeRepository implements DiscussionRepository {
  constructor(private list: Discussion[]) {}
  async updateDiscussionById(
    id: string,
    discussion: Discussion,
  ): Promise<string | null> {
    const oldDiscuttion = this.list.find((el) => el.props.id === id);
    if (!oldDiscuttion) return null;
    const discussionUpdated = Discussion.create({
      id: discussion.props.id,
      title: discussion.props.title,
      description: discussion.props.description,
      author: discussion.props.author,
      createdAt: discussion.props.createdAt,
      comments: discussion.props.comments,
      upvotes: discussion.props.upvotes,
      downvotes: discussion.props.downvotes,
      resolution: discussion.props.resolution,
    });

    if (discussionUpdated.isLeft()) {
      return null;
    }

    this.list = this.list.filter((el) => el.props.id !== id);
    this.list.push(discussionUpdated.value);
    return id;
  }

  async create(discussion: Discussion): Promise<string> {
    const discussionToDbOrFail = Discussion.create({
      author: discussion.props.author,
      description: discussion.props.description,
      title: discussion.props.title,
      comments: discussion.props.comments,
      createdAt: discussion.props.createdAt,
      downvotes: discussion.props.downvotes,
      id: discussion.props.id ?? randomUUID().toString(),
      resolution: discussion.props.resolution,
      upvotes: discussion.props.upvotes,
    });

    if (discussionToDbOrFail.isLeft()) {
      return '0';
    }
    const discussionToDb = discussionToDbOrFail.value;

    this.list.push(discussionToDb);

    return discussionToDb.props.id;
  }
  findById(id: string): Promise<Discussion | null> {
    return Promise.resolve(this.list.find((el) => el.props.id === id) ?? null);
  }
}
