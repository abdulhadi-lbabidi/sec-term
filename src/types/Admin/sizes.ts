export interface Size {
  id: number;
  size: string;
  created_at: string;
}

export interface SizesResponse {
  data: Size[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface CreateSizePayload {
  size: string;
}

export interface UpdateSizePayload {
  id: number;
  size: string;
}
