import { apiClient } from "./apiClient";
import type { Lead, LeadInput, PagedResult } from "../types/lead";

export const leadsService = {
  async list(page: number, pageSize: number): Promise<PagedResult<Lead>> {
    const { data } = await apiClient.get<PagedResult<Lead>>("https://localhost:44358/api/leads", {
      params: { page, pageSize },
    });
    return data;
  },

  async get(id: string): Promise<Lead> {
    const { data } = await apiClient.get<Lead>(`https://localhost:44358/api/leads/${id}`);
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
};
