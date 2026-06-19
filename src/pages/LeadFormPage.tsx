import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { leadsService } from "../services/leadsService";
import type { LeadInput } from "../types/lead";
import { extractErrorMessage } from "../utils/errors";

const empty: LeadInput = {
  name: "",
  email: "",
  phone: "",
  source: "",
  notes: "",
};

export function LeadFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<LeadInput>(empty);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing lead when editing.
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    leadsService
      .get(id)
      .then((lead) => {
        if (cancelled) return;
        setForm({
          name: lead.name,
          email: lead.email,
          phone: lead.phone ?? "",
          source: lead.source ?? "",
          notes: lead.notes ?? "",
        });
      })
      .catch((err) => {
        if (!cancelled) setError(extractErrorMessage(err, "Failed to load lead."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  function update<K extends keyof LeadInput>(field: K, value: LeadInput[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Strip empties so the API sees real nulls/omissions, not blank strings.
    const payload: LeadInput = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim() || undefined,
      source: form.source?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    };

    try {
      if (isEdit && id) {
        await leadsService.update(id, payload);
      } else {
        await leadsService.create(payload);
      }
      navigate("/leads");
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to save lead."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="muted">Loading lead...</div>;
  }

  return (
    <div className="lead-form">
      <div className="page-header">
        <h1>{isEdit ? "Edit lead" : "New lead"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <label className="form__field">
          <span>Name *</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            maxLength={200}
            required
          />
        </label>

        <label className="form__field">
          <span>Email *</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            maxLength={200}
            required
          />
        </label>

        <label className="form__field">
          <span>Phone</span>
          <input
            type="tel"
            value={form.phone ?? ""}
            onChange={(e) => update("phone", e.target.value)}
            maxLength={50}
          />
        </label>

        <label className="form__field">
          <span>Source</span>
          <input
            type="text"
            value={form.source ?? ""}
            onChange={(e) => update("source", e.target.value)}
            placeholder="e.g. website, referral, event"
            maxLength={100}
          />
        </label>

        <label className="form__field">
          <span>Notes</span>
          <textarea
            value={form.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
            rows={5}
            maxLength={2000}
          />
        </label>

        {error && <div className="alert alert--error">{error}</div>}

        <div className="form__actions">
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/leads")}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? "Saving..." : isEdit ? "Save changes" : "Create lead"}
          </button>
        </div>
      </form>
    </div>
  );
}
