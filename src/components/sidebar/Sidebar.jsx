import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";

// Builds a two-letter initials badge from a full name, e.g. "Emma Mitchell" -> "EM".
function getInitials(name) {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "");

  return initials.join("") || "?";
}

const NAV_LINKS = [
  { to: "/orders", label: "Orders", icon: "fa-regular fa-calendar" },
  { to: "/wishlist", label: "Wishlist", icon: "fa-regular fa-heart" },
];

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <Link to="/" className="sidebar-logo">
        modimal.
      </Link>

      <nav className="sidebar-nav">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${
              isActive(link.to) ? "sidebar-link--active" : ""
            }`}
          >
            <i className={link.icon}></i>
            {link.label}
          </Link>
        ))}
      </nav>

      {user && (
        <div className="sidebar-user">
          <div className="sidebar-avatar">{getInitials(user.name)}</div>

          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user.name}</span>
            <span className="sidebar-user-role">Customer</span>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;