export interface Lead {
  id: number;
  name: string;

  dotNumber?: number;
  street: string;
  city: string;
  zip: string;

  state?: string;
  powerUnits?: number;

  phone?: string;
  email?: string;
  website?: string;

  status?: string;
  assignedUser?: string;

  source?: string;
  notes?: string;

  operationStartDate?: string | null;
}

export interface LeadInput {
  name: string;
  email: string;
  phone?: string;
  website: string;
  source?: string;
  notes?: string;
  street: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  sortColumn: string;
  sortDirection: string;
  search: string;
}

export interface LeadActivity {
  id: number;
  activityType: string;
  notes: string | null;
  userName: string | null;
  createdAt: string;
}

export interface LeadDetail extends Lead {
  timesContacted: number;
  lastContactedAt?: string | null;
  activities: LeadActivity[];
  statusId: number;
}

export interface AiSuggestion {
  recommendedAction: string;
  reason: string;
  confidence: string;
  pitch: string;
}

export interface LeadStatusSummary {
  name: string;
  count: number;
}