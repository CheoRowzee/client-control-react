import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { leadsService } from "../services/leadsService";
import type { AiSuggestion, Lead, PagedResult } from "../types/lead";
import { extractErrorMessage } from "../utils/errors";
import { StatusBadge } from "../components/StatusBadge";


const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function LeadsPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<PagedResult<Lead> | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedLeadId] = useState<number | null>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
 
  // Load leads whenever page/pageSize changes. Search is client-side
  // (filters the current page) because the API doesn't support it yet.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    leadsService.list(
        page,
        pageSize,
        sortColumn,
        sortDirection,
        search
      )
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err, "Failed to load leads."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, sortColumn, sortDirection, search]);

 const filteredItems = useMemo(() => {
  if (!data) return [];

  const q = search.trim().toLowerCase();

  if (!q) return data.items;

  return data.items.filter(
    (lead) =>
      lead.name.toLowerCase().includes(q) ||
      lead.email?.toLowerCase().includes(q) ||
      lead.phone?.includes(q) ||
      lead.dotNumber?.toString().includes(q)
  );
}, [data, search]);

  
  const totalPages = data?.totalPages ?? 1;
  const canPrev = page > 1;
  const canNext = page < totalPages;

    async function handleAskAi(leadId: number) {
    try {
      setSelectedLeadId(leadId);
      setShowAiPanel(true);
      setAiLoading(true);
      setAiSuggestion(null);

      const suggestion =
        await leadsService.getAiSuggestion(leadId);

      setAiSuggestion(suggestion);

    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  }

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    setPage(1);
  }

  return (
    <div className="leads-page">
      <div className="page-header">
        
        <div>
         <h1 className="page-title">
            <span className="brand-io">IO</span>
            <span className="text-black">Leads</span>
          </h1>
          <p className="muted">
            {data ? '' : "Loading..."}
          </p>
        </div>

        <button
          type="button"
          className="btn btn--primary"
          onClick={() => navigate("/leads/new")}
        >
          + New Lead
        </button>
      </div>
      {showAiPanel && (
  <div className="ai-panel">

    <div className="ai-panel__header">
      <h2>
        <span className="text-black">C</span>
        <span className="brand-io">IO</span>
        <span className="text-black">AI</span>
      </h2>

      <button
        type="button"
        className="ai-panel__close"
        onClick={() => setShowAiPanel(false)}
      >
        ✕
      </button>
    </div>

    {aiLoading && (
      <div className="ai-loading">
        <span className="text-black">C</span>
        <span className="brand-io">IO</span>
        <span className="text-black"> AI</span> is analyzing lead activity...
    </div>
    )}

    {!aiLoading && aiSuggestion && (
      <div className="ai-suggestion">

        <div className="ai-card">
          <span className="ai-label">
            Recommended Action
          </span>

          <p className="ai-value">
            {aiSuggestion.recommendedAction}
          </p>
        </div>

        <div className="ai-card">
          <span className="ai-label">
            Reason
          </span>

          <p className="ai-value">
            {aiSuggestion.reason}
          </p>
        </div>

         <div className="ai-card">
          <span className="ai-label">
            Sales Pitch
          </span>

          <p className="ai-value">
            {aiSuggestion.pitch}
          </p>
        </div>

        <div className="ai-card">
          <span className="ai-label">
            Confidence
          </span>

          <div
            className={`ai-confidence ai-confidence--${aiSuggestion.confidence.toLowerCase()}`}
          >
            {aiSuggestion.confidence}
          </div>
        </div>

      </div>
    )}

  </div>
)}

      <div className="toolbar">
        <input
          type="search"
          className="toolbar__search"
          placeholder="Search Business Name, DOT, phone, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="toolbar__field">
          Page size:&nbsp;
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th  className="sortable" onClick={() => handleSort("name")}>
                Company Name {sortColumn === "name" && (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th  className="sortable" onClick={() => handleSort("dOT")}>
                DOT {sortColumn === "dot" && (sortDirection === "asc" ? " ↑" : " ↓")}</th>
              <th  className="sortable" onClick={() => handleSort("street")}>
                Street {sortColumn === "street" && (sortDirection === "asc" ? " ↑" : " ↓")}</th>
              <th  className="sortable" onClick={() => handleSort("city")}>
                City {sortColumn === "city" && (sortDirection === "asc" ? " ↑" : " ↓")}</th>
              <th  className="sortable" onClick={() => handleSort("state")}>
                State {sortColumn === "state" && (sortDirection === "asc" ? " ↑" : " ↓")}</th>
              <th  className="sortable" onClick={() => handleSort("zip")}>
                Zip {sortColumn === "zip" && (sortDirection === "asc" ? " ↑" : " ↓")}</th>
              <th  className="sortable" onClick={() => handleSort("powerUnits")}>
                Units {sortColumn === "powerUnits" && (sortDirection === "asc" ? " ↑" : " ↓")}</th>
              <th  className="sortable" onClick={() => handleSort("operationStartDate")}>
                Operation Start Date {sortColumn === "operationStartDate" && (sortDirection === "asc" ? " ↑" : " ↓")}</th>
              <th  className="sortable" onClick={() => handleSort("phone")}>
                Phone {sortColumn === "phone" && (sortDirection === "asc" ? " ↑" : " ↓")}</th>
              <th  className="sortable" onClick={() => handleSort("email")}>
                Email {sortColumn === "email" && (sortDirection === "asc" ? " ↑" : " ↓")}</th>
              <th  className="sortable" onClick={() => handleSort("status")}>
                Status {sortColumn === "status" && (sortDirection === "asc" ? " ↑" : " ↓")}</th>
              <th>AI</th>
              <th aria-label="actions" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="table__empty">
                  Loading leads...
                </td>
              </tr>
            )}
            {!loading && filteredItems.length === 0 && (
              <tr>
                <td colSpan={8} className="table__empty">
                  {search
                    ? "No leads match your search on this page."
                    : "No leads yet. Create your first one!"}
                </td>
              </tr>
            )}
            {!loading &&
              data?.items.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link
                      to={`/leads/${lead.id}`}
                      style={{ color: "blue" }}>
                      {lead.name}
                  </Link>
                  </td>

                  <td>
                    {lead.dotNumber || "—"}
                  </td>
                  <td>
                    {lead.street || "—"}
                  </td>
                  <td>
                    {lead.city || "—"}
                  </td>               

                  <td>
                    {lead.state || "—"}
                  </td>
                  <td>
                    {lead.zip || "—"}
                  </td>

                  <td>
                    {lead.powerUnits || "—"}
                  </td>
                  
                  <td>
                    {lead.operationStartDate
                      ? new Date(lead.operationStartDate).toLocaleDateString("en-US")
                      : "—"}
                  </td>

                  <td>
                    {lead.phone || "—"}
                  </td>
                  <td>
                    {lead.email || "—"}
                  </td>

                  <td>
                      <StatusBadge status={lead.status} />
                  </td> 

                  <td className="ai-column">
                    <button
                      className="btn--ai"
                      onClick={() => handleAskAi(lead.id)}
                    >
                    <span className="text-black">C</span>
                    <span className="brand-io">IO</span>
                    <span className="text-black"> AI</span>
                    </button>
                </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          type="button"
          className="btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!canPrev}
        >
          ← Previous
        </button>
        <span className="pagination__info">
          Page {page} of {totalPages || 1}
        </span>
        <button
          type="button"
          className="btn"
          onClick={() => setPage((p) => p + 1)}
          disabled={!canNext}
        >
          Next →
        </button>
      </div>   

    </div>
  );
}

