import { UseCase } from '@common/core/useCase';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import { Either, left, right } from '@common/core/either';
import BaseError from '@common/errors/baseError.error';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { PaginationParams } from '@common/core/pagination';
import Inspetor from '@common/core/inspetor';

type GetDiscussionInput = {
  paginationParams: PaginationParams;
};
type GetDiscussionOutput = Promise<
  Either<BaseError, { result: Discussion[]; count: number }>
>;

export class GetDiscussionUseCase
  implements UseCase<GetDiscussionInput, GetDiscussionOutput>
{
  constructor(private readonly discussionRepository: DiscussionRepository) {}

  async perform(input?: {
    paginationParams: PaginationParams;
  }): Promise<GetDiscussionOutput> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      {
        argument: input.paginationParams.page,
        argumentName: 'paginationParams.page',
      },
      {
        argument: input.paginationParams.pageSize,
        argumentName: 'paginationParams.pageSize',
      },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const result = await this.discussionRepository.findDiscussions(input);

    return right(result);
  }
}
