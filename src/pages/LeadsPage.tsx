import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { leadsService } from "../services/leadsService";
import type { Lead, PagedResult } from "../types/lead";
import { extractErrorMessage } from "../utils/errors";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function LeadsPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<PagedResult<Lead> | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load leads whenever page/pageSize changes. Search is client-side
  // (filters the current page) because the API doesn't support it yet.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    leadsService
      .list(page, pageSize)
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
  }, [page, pageSize]);

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

  return (
    <div className="leads-page">
      <div className="page-header">
        <div>
          <h1>Future Clients</h1>
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

      <div className="toolbar">
        <input
          type="search"
          className="toolbar__search"
          placeholder="Search carrier, DOT, phone, email..."
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
              <th>Carrier</th>
              <th>DOT</th>
              <th>State</th>
              <th>Units</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Assigned</th>
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
              filteredItems.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link to={`/leads/${lead.id}`}>
                      {lead.name}
                    </Link>
                  </td>

                  <td>
                    {lead.dotNumber || "—"}
                  </td>

                  <td>
                    {lead.state || "—"}
                  </td>

                  <td>
                    {lead.powerUnits || "—"}
                  </td>

                  <td>
                    {lead.phone || "—"}
                  </td>
                  <td>
                    {lead.email || "—"}
                  </td>

                  <td>
                    {lead.status || "New"}
                  </td>

                  <td>
                    {lead.assignedUser || "Unassigned"}
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
