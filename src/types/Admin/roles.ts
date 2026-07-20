export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
}

export interface RolesResponse {
  data: Role[];
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

export interface Permission {
  id: number;
  name: string;
  display_name: string;
  guard_name: string;
}

export interface PermissionsResponse {
  data: Permission[];
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

export interface RoleDetail {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  permissions: Permission[];
}

export interface RoleDetailResponse {
  data: RoleDetail;
}

export interface CreateRolePayload {
  name: string;
  permissions: number[];
}

export interface UpdateRolePayload {
  id: number;
  name: string;
  permissions: number[];
}
