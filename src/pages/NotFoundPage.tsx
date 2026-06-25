import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="auth-card" style={{ textAlign: "center" }}>
      <h1>404</h1>
      <p className="muted">That page does not exist.</p>
      <Link to="/" className="btn btn--primary">
        Go home
      </Link>
    </div>
  );
}
