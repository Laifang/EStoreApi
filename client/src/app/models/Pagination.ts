export interface MetaData {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// 定义泛型分页响应类，用于在接口返回值中包含分页信息
export class PaginatedResponse<T> {
  items: T;
  metaData: MetaData;

  constructor(items: T, metaData: MetaData) {
    this.items = items;
    this.metaData = metaData;
  }
}
