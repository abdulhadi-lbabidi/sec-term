export interface RoleInUser {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
}

export interface UserItem {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  roles: RoleInUser[];
}

export interface UsersResponse {
  data: UserItem[];
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

export interface UserCreatePayload {
  name: string;
  email: string;
  password?: string;
  roles: string[] | number[];
  is_active: boolean | number;
}

export interface UserUpdatePayload {
  name: string;
  email: string;
  password?: string;
  roles: string[] | number[];
  is_active: boolean | number;
}
