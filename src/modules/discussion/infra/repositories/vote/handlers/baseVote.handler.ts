import { findOneByFilterInput } from '@modules/discussion/application/repositories/vote.repository';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import { DeleteResult, EntityManager, In, Repository } from 'typeorm';

export abstract class BaseVoteHandler<T> {
  abstract createEntity(vote: Vote): T;
  abstract getRepository(entityManager: EntityManager): Repository<T>;
  abstract toDomain(voteDB: T): Vote;

  async save(vote: Vote, entityManager: EntityManager): Promise<T> {
    const repository = this.getRepository(entityManager);
    const entity = this.createEntity(vote);
    return repository.save(entity);
  }

  async deleteById(
    id: string,
    entityManager: EntityManager,
  ): Promise<DeleteResult> {
    const repository = this.getRepository(entityManager);
    return repository.delete({ id: +id as any });
  }

  async deleteByVoteForReferency(
    ids: string[],
    entityManager: EntityManager,
  ): Promise<DeleteResult> {
    const repository = this.getRepository(entityManager);
    return repository.delete({ id: In(ids) as any });
  }

  async findOneByFilter(
    filter: findOneByFilterInput,
    entityManager: EntityManager,
  ) {
    const repository = this.getRepository(entityManager);
    const entity = await repository.findOneBy({
      userId: filter.user ? +filter.user : undefined,
      id: filter.voteForReferency ? +filter.voteForReferency : undefined,
    } as any);

    return entity;
  }
}
