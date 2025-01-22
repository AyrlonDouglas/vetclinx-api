import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class OnlyCreatorCanUpdateError extends BaseError {
  constructor() {
    super(
      [`Only the creator of the discussion can update it.`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'UpdateDiscussionOnlyCreatorCanUpdateError';
  }
}

const UpdateDiscussionErrors = {
  OnlyCreatorCanUpdateError,
};

export default UpdateDiscussionErrors;
