export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  source?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadInput {
  name: string;
  email: string;
  phone?: string;
  source?: string;
  notes?: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
