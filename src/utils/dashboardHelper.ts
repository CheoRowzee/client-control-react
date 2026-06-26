import type { Lead, LeadStatusSummary } from "../types/lead";



export function getLeadStatusCounts(leads: Lead[]): LeadStatusSummary[] {
  const statusCounts = leads.reduce<Record<string, number>>((acc, lead) => {
    const status = lead.status ?? "Unknown";

    acc[status] = (acc[status] || 0) + 1;

    return acc;
  }, {});

  return Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count,
  }));
}