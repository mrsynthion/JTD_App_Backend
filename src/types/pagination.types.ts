export type SortBy<T> = keyof T;
export type SortDirection = "ASC" | "DESC";

export interface Payload<T> {
  size: number;
  page: number;
  sort: [SortBy<T>, SortDirection];
}

export type Filters<T> = Partial<Payload<T> & T>;

export interface Page<T> {
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  content: Array<T>;
}
