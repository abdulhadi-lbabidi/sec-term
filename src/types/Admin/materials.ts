export interface Material {
  id: number;
  material: string;
  created_at: string;
}

export interface MaterialsResponse {
  data: Material[];
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

export interface MaterialDetailResponse {
  data: {
    id: number;
    material: {
      ar: string;
      en: string;
    };
    created_at: string;
  };
}

export interface CreateMaterialPayload {
  materialAr: string;
  materialEn: string;
}

export interface UpdateMaterialPayload {
  id: number;
  formData: FormData;
}
