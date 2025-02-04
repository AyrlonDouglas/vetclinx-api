export class Pagination<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  constructor(items: T[], totalItems: number, params: PaginationParams) {
    this.currentPage = params.page;
    this.pageSize = params.pageSize;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / params.pageSize);
    this.hasNextPage = this.currentPage < this.totalPages;
    this.hasPreviousPage = this.currentPage > 1;
    this.items = items;
  }
}

export class PaginationParams {
  page: number;
  pageSize: number;
  constructor(page: number = 1, pageSize: number = 10) {
    this.page = +page;
    this.pageSize = +pageSize;
  }
}
