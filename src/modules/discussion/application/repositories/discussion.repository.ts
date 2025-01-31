import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';

export abstract class DiscussionRepository {
  abstract save(discussion: Discussion): Promise<string>;
  abstract create(discussion: Discussion): Promise<string>;
  abstract findById(id: string): Promise<Discussion | null>;
  abstract updateDiscussionById(
    id: string,
    discussion: Discussion,
  ): Promise<string | null>;
  abstract deleteById(id: string): Promise<number>;
  abstract findDiscussions(): Promise<Discussion[]>;
}
