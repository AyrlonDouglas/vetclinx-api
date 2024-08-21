import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { randomUUID } from 'crypto';

export class DiscussionFakeRepository implements DiscussionRepository {
  constructor(private list: Discussion[]) {}
  findById(id: string): Promise<Discussion | null> {
    return Promise.resolve(this.list.find((el) => el.props.id === id));
  }

  async save(discussion: Discussion): Promise<string> {
    const discussionToDbOrFail = Discussion.create({
      authorId: discussion.props.authorId,
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
}
