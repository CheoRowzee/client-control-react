import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { extractErrorMessage } from "../utils/errors";

interface LocationState {
  from?: { pathname?: string };
}

export function LoginPage() {
  console.log("LOGIN PAGE RENDERED");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? "/leads";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("handleSubmit fired");

    setError(null);
    setSubmitting(true);
    try {
      console.log("before login");
      await login({ email, password });
      console.log("after login");

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, "Login failed."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Log in</h1>
      <p className="muted">Welcome back. Enter your credentials to continue.</p>

      <form onSubmit={handleSubmit} className="form">
        <label className="form__field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="form__field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div className="alert alert--error">{error}</div>}

        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="muted">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
