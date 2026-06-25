import { apiClient } from "./apiClient";
import type { Lead, LeadDetail, LeadInput, PagedResult } from "../types/lead";



export const leadsService = {
  async list( page: number,pageSize: number,sortColumn: string,sortDirection: string,search: string): Promise<PagedResult<Lead>> {
    const { data } = await apiClient.get<PagedResult<Lead>>("/leads", {
        params: {
        page,
        pageSize,
        sortColumn,
        sortDirection,
        search,
      },
    });
    return data;
  },

  async get(id: number): Promise<Lead> {
    const { data } = await apiClient.get<Lead>(`/leads/${id}`);
    return data;
  },

  async getDetail(id: number): Promise<LeadDetail> {
    const { data } = await apiClient.get<LeadDetail>(`/leads/${id}/detail`);
    return data;
  },

  async create(payload: LeadInput): Promise<Lead> {
    const { data } = await apiClient.post<Lead>("/leads", payload);
    return data;
  },

  async update(id: string, payload: LeadInput): Promise<Lead> {
    const { data } = await apiClient.put<Lead>(`/leads/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/leads/${id}`);
  },

  async updateStatus(id: number, status: string) {
  await apiClient.put(`/leads/${id}/status`, {
        status
    });
  },
  async getAiSuggestion(id: number) {
     const response = await apiClient.get(`/AI/${id}/ai-suggestion`
  );

    return response.data;
  },
  async addActivity(leadId: number, request: { activityType: string; notes: string;
  }): Promise<void> {
    await apiClient.post(`/leads/${leadId}/activity`, request);
 },
};
