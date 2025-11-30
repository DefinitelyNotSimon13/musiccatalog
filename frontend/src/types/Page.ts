export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageRequest extends Record<string, unknown> {
  page?: number;
  size?: number;
  q?: string; // search query
}
