import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { leadsService } from "../services/leadsService";
import type { LeadDetail } from "../types/lead";
import { extractErrorMessage } from "../utils/errors";

export function LeadDetailPage() {
  const { id } = useParams();

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activityType, setActivityType] = useState("Call");
  const [activityNotes, setActivityNotes] = useState("");
  const [savingActivity, setSavingActivity] = useState(false);
  const [status, setStatus] = useState("New");
  const [, setSavingStatus] = useState(false);  

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    leadsService
      .getDetail(Number(id))
      .then((data) => {
    setLead(data);
    setStatus(data.status ?? "New");})
      .catch((err) =>
        setError(extractErrorMessage(err, "Failed to load lead."))
      )
      .finally(() => setLoading(false));

  }, [id]);


     async function handleAddActivity() {
    if (!lead) return;

    setSavingActivity(true);
    setError(null);        
        

    try {
      await leadsService.addActivity(lead.id, {
        activityType,
        notes: activityNotes,
      });

      setActivityNotes("");

      const updatedLead = await leadsService.getDetail(lead.id);
      setLead(updatedLead);

    } catch (err) {
      setError(
        extractErrorMessage(err, "Failed to add activity.")
      );
    } finally {
      setSavingActivity(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!lead) return;

    if (newStatus === status) {
      return;
    }

    setSavingStatus(true);
    setError(null);

    try {
      await leadsService.updateStatus(
        lead.id,
        newStatus
      );

      setStatus(newStatus);

      const updatedLead =
        await leadsService.getDetail(lead.id);

      setLead(updatedLead);

    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          "Failed to update status."
        )
      );
    } finally {
      setSavingStatus(false);
    }
  }


  if (loading) {
    return <div>Loading lead...</div>;
  }


  if (error) {
    return (
      <div className="alert alert--error">
        {error}
      </div>
    );
  }


  if (!lead) {
    return <div>Lead not found.</div>;
  }


  return (
    <div className="lead-detail">

      <div className="page-header">
        <div>
          <p className="muted">
          </p>
        </div>

        <Link
          to={`/leads/${lead.id}/edit`}
          className="btn btn--primary"
        >
          Edit Lead
        </Link>
      </div>


      <div className="card">

        <div className="detail-grid">
          <DetailItem 
            label="Company Name"
            value={lead.name}
          />

          <DetailItem
            label="DOT Number"
            value={lead.dotNumber?.toString() ?? "—"}
          />

          <DetailItem
            label="State"
            value={lead.state ?? "—"}
          />

          <DetailItem
            label="Power Units"
            value={lead.powerUnits?.toString() ?? "—"}
          />
        </div>
      </div>


      <div className="card">

        <div className="detail-grid">
          <DetailItem
            label="Phone"
            value={lead.phone ?? "—"}
          />

          <DetailItem
            label="Email"
            value={lead.email ?? "—"}
          />
        </div>
      </div>


      <div className="card">

    <div className="detail-grid">
        <div className="detail-item">
        <span className="detail-label">
            Status
        </span>

     <div className="status-buttons">
  {[
    "New",
  "Contacted",
  "Quoted",
  "Follow Up",
  "Won",
  "Lost"
  ].map((item) => (
    <button
      key={item}
      type="button"
      className={`status-btn status-${item
        .toLowerCase()
        .replace(" ", "-")} ${
          status === item ? "active" : ""
        }`}
      onClick={() => handleStatusChange(item)}
    >
      {item}
    </button>
  ))}
</div>
        </div>

          <DetailItem
            label="Assigned To"
            value={lead.assignedUser ?? "Unassigned"}
          />

          <DetailItem
            label="Times Contacted"
            value={lead.timesContacted.toString()}
          />

          <DetailItem
            label="Last Contacted"
            value={
              lead.lastContactedAt
                ? new Date(
                    lead.lastContactedAt
                  ).toLocaleString()
                : "Never"
            }
          />
        </div>
      </div>

      <div className="card">

        <div className="activity-form">
          <span className="detail-label">
            Activity Type
          </span>

          <select
            value={activityType}
            onChange={(e) =>
              setActivityType(e.target.value)
            }
          >
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="Note">Note</option>
            <option value="Meeting">Meeting</option>
          </select>
        </div>


        <textarea
          className="activity-notes"
          placeholder="Enter notes..."
          value={activityNotes}
          onChange={(e) =>
            setActivityNotes(e.target.value)
          }
        />


        <button
          className="btn btn--primary"
          onClick={handleAddActivity}
          disabled={savingActivity}
        >
          {savingActivity
            ? "Saving..."
            : "Add Activity"}
        </button>

      </div>
      


      <div className="card activity-card">
        <h2 className="brand-intelligence">Activity History</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Type</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>

            {!lead.activities ||
            lead.activities.length === 0 ? (

              <tr>
                <td
                  colSpan={4}
                  className="table__empty"
                >
                  No activity recorded.
                </td>
              </tr>

            ) : (

              lead.activities.map((activity) => (

                <tr key={activity.id}>

                  <td>
                    {new Date(
                      activity.createdAt
                    ).toLocaleString()}
                  </td>

                  <td>
                    {activity.userName ?? "Unknown"}
                  </td>

                  <td>
                    {activity.activityType}
                  </td>

                  <td>
                    {activity.notes ?? "—"}
                  </td>

                </tr>

              ))

            )}

          </tbody>
        </table>
      </div>    

    </div>
  );
}


function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="detail-item">
      <span className="detail-label">
        {label}
      </span>

      <span className="detail-value">
        {value}
      </span>
    </div>
  );
}