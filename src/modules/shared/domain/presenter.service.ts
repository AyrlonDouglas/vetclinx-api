import { Pagination, PaginationParams } from '@common/core/pagination';
import { ApiPresenter } from '@common/infra/Api.presenter';

export class PresenterService {
  paginate<T>(input: {
    data: T[];
    total: number;
    params: PaginationParams;
    message: string;
  }): ApiPresenter<Pagination<T>> {
    const { data, message, params, total } = input;
    return new ApiPresenter({
      message,
      result: new Pagination(data, total, params),
    });
  }

  present<T>(params: { result: T; message: string }): ApiPresenter<T> {
    const { message, result } = params;
    return new ApiPresenter({ message, result });
  }
}
