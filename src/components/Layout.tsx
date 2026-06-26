import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Layout() {
  const { isAuthenticated, email, name, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
         <Link to="/" className="app-brand">
          <span className="brand-c">C</span>
          <span className="brand-io">IO</span>
          <span className="brand-intelligence">Intelligence</span>
        </Link>

          <nav className="app-nav">
            {isAuthenticated && (
              <>
                <NavLink to="/leads" className="app-nav__link">
                 Dashboard
                </NavLink>
                <NavLink to="/leads/new" className="app-nav__link">
                  New Lead
                </NavLink>
              </>
            )}
          </nav>

          <div className="app-header__actions">
            {isAuthenticated ? (
              <>
                <span className="app-user">{name || email}</span>
                <button type="button" className="btn btn--ghost" onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="app-nav__link">
                  Log in
                </NavLink>
                <NavLink to="/register" className="app-nav__link">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
