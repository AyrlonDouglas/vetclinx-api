import { Mapper } from '@common/infra/Mapper';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import { VoteModel } from '../schemas/vote.schema';
import { Types } from 'mongoose';
import {
  VoteFor,
  VoteTypes,
} from '@modules/discussion/domain/component/voteManager.component';

export class VoteMapper implements Mapper<Vote> {
  toPersistense(data: Vote): VoteModel {
    const voteModel = new VoteModel();
    voteModel.createdAt = data.props.createdAt;
    voteModel.updatedAt = data.props.updatedAt;
    voteModel.user = data.props.user
      ? new Types.ObjectId(data.props.user)
      : null;
    voteModel.voteFor = data.props.voteFor;
    voteModel.voteForReferency = data.props.voteForReferency
      ? new Types.ObjectId(data.props.voteForReferency)
      : null;
    voteModel.voteType = data.props.voteType;
    return voteModel;
  }

  toDomain(data: voteRawToDomain): Vote {
    const vote = Vote.create({
      user: data.user,
      voteFor: data.voteFor,
      voteForReferency: data.voteForReferency,
      voteType: data.voteType,
      createdAt: data.createdAt,
      id: data.id,
      updatedAt: data.updatedAt,
    });

    return vote.value as Vote;
  }

  toDTO(data: Vote) {
    data;
    throw new Error('Method not implemented.');
  }
}

type voteRawToDomain = {
  user: string;
  voteFor: keyof typeof VoteFor;
  voteForReferency: string;
  voteType: keyof typeof VoteTypes;
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
