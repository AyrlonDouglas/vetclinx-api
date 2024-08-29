import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';

export abstract class DiscussionRepository {
  abstract create(discussion: Discussion): Promise<string>;
  abstract findById(id: string): Promise<Discussion | null>;
  abstract updateById(
    id: string,
    discussion: Discussion,
  ): Promise<string | null>;
}
