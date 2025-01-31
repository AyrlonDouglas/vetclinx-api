import { UseCase } from '@common/core/useCase';
import { DiscussionRepository } from '../../repositories/discussion.repository';

type GetDiscussionInput = {};
type GetDiscussionOutput = {};

// export class GetDiscussionUseCase
//   implements UseCase<GetDiscussionInput, GetDiscussionOutput>
// {
//   constructor(private readonly discussionRepository: DiscussionRepository) {}

//   perform(
//     input?: GetDiscussionInput,
//   ): GetDiscussionOutput | Promise<GetDiscussionOutput> {
//     // this.discussionRepository.
//   }
// }
