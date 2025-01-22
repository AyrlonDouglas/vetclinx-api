import { DiscussionProps } from '@modules/discussion/domain/entities/discussion/discussion.entity';

export type UpdateDiscussionDTO = Pick<Required<DiscussionProps>, 'id'> &
  Pick<Partial<DiscussionProps>, 'description' | 'resolution' | 'title'>;
