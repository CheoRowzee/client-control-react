
import type { LeadStatusSummary } from "../types/lead";
import { getLeadStatusCounts } from "../utils/dashboardHelper";
import { useEffect, useState } from "react";
import { leadsService } from "../services/leadsService";
import { useAuth } from "../hooks/useAuth";


export function DashboardPage() {

   const { name, companyName } = useAuth();

  const metrics = {
    forecastRevenue: 18400,
    closedRevenue: 11250,
    pipeline: 42800,
    winRate: 64,
  };
 
   const [leadStatus, setLeadStatus] = useState<LeadStatusSummary[]>([]);

  useEffect(() => {
    async function loadStatuses() {
      const result = await leadsService.list(
        1,
        500,
        "createdDate",
        "desc",
        ""
      );

      const statuses = getLeadStatusCounts(result.items ?? []);

      setLeadStatus(statuses);
    }

    loadStatuses();
  }, []);
 
  const upcomingClosings = [
    {
      company: "ABC Trucking",
      amount: 2300,
      date: "Jun 30",
    },
    {
      company: "Great Lakes Logistics",
      amount: 1750,
      date: "Jul 2",
    },
    {
      company: "Acme Manufacturing",
      amount: 4200,
      date: "Jul 4",
    },
  ];

  const monthlyRevenue = [
    { month: "Jan", amount: 8200 },
    { month: "Feb", amount: 9400 },
    { month: "Mar", amount: 11750 },
    { month: "Apr", amount: 13800 },
    { month: "May", amount: 16900 },
    { month: "Jun", amount: 11250 },
  ];

  return (
      <div className="dashboard">

      <div className="page-header">

        <div>
          <h1 className="page-title">
            <span className="brand-io">IO</span>
            <span className="text-black"> Dashboard</span>
          </h1>

          <p className="muted">
            Good afternoon, {name}
          </p>

          <p className="dashboard-company">
            {companyName}
          </p>
        </div>
      </div>

      {/* KPI Cards */}

      <div className="dashboard-grid dashboard-grid--4">

        <div className="metric-card">
          <h3>Forecast Revenue</h3>
          <h2>${metrics.forecastRevenue.toLocaleString()}</h2>
        </div>

        <div className="metric-card">
          <h3>Closed Revenue</h3>
          <h2>${metrics.closedRevenue.toLocaleString()}</h2>
        </div>

        <div className="metric-card">
          <h3>Pipeline</h3>
          <h2>${metrics.pipeline.toLocaleString()}</h2>
        </div>

        <div className="metric-card">
          <h3>Win Rate</h3>
          <h2>{metrics.winRate}%</h2>
        </div>

      </div>

      {/* Lead Status */}

     <div className="dashboard-section dashboard-section--full">

      <h2>Lead Status</h2>

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {leadStatus.map((status) => (
            <tr key={status.name}>
              <td>
                <span className={`status-badge status-${status.name.toLowerCase().replace(" ", "-")}`}>
                  {status.name}
                </span>
              </td>
              <td>{status.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

      {/* Upcoming Closings */}

      <div className="dashboard-section">

        <h2>Upcoming Closings</h2>

        <table className="dashboard-table dashboard-table--closings">
          <thead>
            <tr>
              <th>Company</th>
              <th>Revenue</th>
              <th>Expected Close</th>
            </tr>
          </thead>

          <tbody>
            {upcomingClosings.map((closing) => (
              <tr key={closing.company}>
                <td>{closing.company}</td>
                <td>${closing.amount.toLocaleString()}</td>
                <td>{closing.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* Monthly Revenue */}

      <div className="dashboard-section">

        <h2>Monthly Revenue</h2>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {monthlyRevenue.map((month) => (
              <tr key={month.month}>
                <td>{month.month}</td>
                <td>${month.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* Goal */}

      <div className="dashboard-section">

        <h2>Monthly Goal</h2>

        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: "72%" }}
          />
        </div>

        <p>
          Goal: <strong>$25,000</strong>
        </p>

        <p>
          Forecast: <strong>$18,400</strong>
        </p>

      </div>

      {/* Needs Attention */}

      <div className="dashboard-section">

        <h2>Needs Attention</h2>

        <ul className="attention-list">
          <li>⚠ 3 quotes expire this week</li>
          <li>⚠ 5 leads have had no activity in 14 days</li>
          <li>⚠ $6,200 in quoted business has no follow-up scheduled</li>
        </ul>

      </div>

    </div>
  );
}