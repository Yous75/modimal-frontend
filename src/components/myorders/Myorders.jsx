import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Myorders.css";
import { getOrders } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";

// Formats the order date in a readable format.
function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Formats prices consistently.
function currency(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

// Converts backend status values into display-friendly text.
function formatStatus(status) {
  if (!status) return "Processing";

  const normalized = status.toUpperCase();

  if (normalized === "PENDING") return "Processing";
  if (normalized === "SHIPPED") return "Shipped";
  if (normalized === "DELIVERED") return "Delivered";
  if (normalized === "CANCELLED") return "Cancelled";
  if (normalized === "REFUNDED") return "Refunded";

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

// Returns the CSS class suffix used for each order status.
function statusKey(status) {
  const normalized = String(status || "PENDING").toUpperCase();

  if (normalized === "PENDING") return "pending";
  if (normalized === "SHIPPED") return "shipped";
  if (normalized === "DELIVERED") return "delivered";
  if (normalized === "CANCELLED") return "cancelled";
  if (normalized === "REFUNDED") return "refunded";

  return "pending";
}

// Sums the quantity of every item in an order.
function totalQty(order) {
  return (
    order.items?.reduce(
      (sum, item) => sum + Number(item.qty || 0),
      0
    ) || 0
  );
}

// Builds a short order reference from the MongoDB id.
function orderNumber(order) {
  return `#${String(order._id).slice(-4).toUpperCase()}`;
}

// Creates and downloads the order history as CSV.
function downloadHistory(orders) {
  const header = [
    "Order",
    "Date",
    "Product",
    "Category",
    "Qty",
    "Status",
    "Total",
  ];

  const rows = orders.map((order) => {
    const primaryItem = order.items?.[0] || {};

    return [
      orderNumber(order),
      formatDate(order.placedAt),
      primaryItem.title || "Product",
      primaryItem.category || "—",
      totalQty(order),
      formatStatus(order.orderStatus),
      currency(order.total),
    ];
  });

  const csv = [header, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "order-history.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

const TABS = [
  {
    key: "all",
    label: "All",
    statuses: null,
  },
  {
    key: "processing",
    label: "Processing",
    statuses: ["PENDING"],
  },
  {
    key: "shipped",
    label: "Shipped",
    statuses: ["SHIPPED"],
  },
  {
    key: "delivered",
    label: "Delivered",
    statuses: ["DELIVERED"],
  },
  {
    key: "cancelled",
    label: "Cancelled",
    statuses: ["CANCELLED"],
  },
  {
    key: "refunded",
    label: "Refunded",
    statuses: ["REFUNDED"],
  },
];

function Myorders() {
  const { isLoggedIn } = useAuth();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Loads the logged-in customer's orders.
  useEffect(() => {
    if (!isLoggedIn) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await getOrders();

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        setLoadError(
          error?.message || "Couldn't load your orders right now."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [isLoggedIn]);

  // Calculates the number of orders for each status.
  const counts = useMemo(() => {
    const byStatus = (status) =>
      orders.filter(
        (order) =>
          String(order.orderStatus || "PENDING").toUpperCase() === status
      ).length;

    return {
      all: orders.length,
      processing: byStatus("PENDING"),
      shipped: byStatus("SHIPPED"),
      delivered: byStatus("DELIVERED"),
      cancelled: byStatus("CANCELLED"),
      refunded: byStatus("REFUNDED"),
    };
  }, [orders]);

  // Filters orders according to the selected tab and search.
  const visibleOrders = useMemo(() => {
    const tab = TABS.find((item) => item.key === activeTab);
    const term = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const status = String(
        order.orderStatus || "PENDING"
      ).toUpperCase();

      if (tab?.statuses && !tab.statuses.includes(status)) {
        return false;
      }

      if (!term) {
        return true;
      }

      const primaryItem = order.items?.[0] || {};

      const haystack = `
        ${orderNumber(order)}
        ${primaryItem.title || ""}
        ${primaryItem.category || ""}
        ${formatStatus(order.orderStatus)}
      `.toLowerCase();

      return haystack.includes(term);
    });
  }, [orders, activeTab, searchTerm]);

  // Logged-out state.
  if (!isLoggedIn) {
    return (
      <main className="myorders-page">
        <div className="myorders-login-message">
          <div className="myorders-login-icon">
            <i className="fa-regular fa-user"></i>
          </div>

          <h1>Sign In To View Your Orders</h1>

          <p>
            Please sign in to your Modimal account to view your
            previous orders and their status.
          </p>

          <Link to="/" className="myorders-primary-btn">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="myorders-page">
      <div className="myorders-container">

        {/* Page heading */}
        <header className="myorders-header">
          <div className="myorders-title-group">
            <h1>My Orders</h1>

            <span className="myorders-count">
              {orders.length} total
            </span>
          </div>

          <button
            type="button"
            className="myorders-download-btn"
            onClick={() => downloadHistory(orders)}
            disabled={isLoading || orders.length === 0}
          >
            <i className="fa-solid fa-download"></i>
            Download History
          </button>
        </header>

        {/* Loading */}
        {isLoading && (
          <div className="myorders-state">
            <div className="myorders-spinner"></div>

            <p>Loading your orders...</p>
          </div>
        )}

        {/* Error */}
        {!isLoading && loadError && (
          <div className="myorders-state myorders-state--error">
            <div className="myorders-state-icon">
              <i className="fa-solid fa-circle-exclamation"></i>
            </div>

            <h2>Couldn't Load Your Orders</h2>

            <p>{loadError}</p>

            <button
              type="button"
              className="myorders-primary-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !loadError && orders.length === 0 && (
          <div className="myorders-state">
            <div className="myorders-state-icon">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed an order yet.
              Start exploring our collection.
            </p>

            <Link
              to="/shop-all"
              className="myorders-primary-btn"
            >
              Shop Now
            </Link>
          </div>
        )}

        {/* Orders */}
        {!isLoading && !loadError && orders.length > 0 && (
          <>
            {/* Summary cards */}
            <div className="myorders-summary">

              <div className="myorders-summary-card">
                <div className="myorders-summary-top">
                  <span className="myorders-summary-label">
                    PROCESSING
                  </span>

                  <span className="myorders-dot myorders-dot--pending"></span>
                </div>

                <strong>{counts.processing}</strong>
              </div>

              <div className="myorders-summary-card">
                <div className="myorders-summary-top">
                  <span className="myorders-summary-label">
                    SHIPPED
                  </span>

                  <span className="myorders-dot myorders-dot--shipped"></span>
                </div>

                <strong>{counts.shipped}</strong>
              </div>

              <div className="myorders-summary-card">
                <div className="myorders-summary-top">
                  <span className="myorders-summary-label">
                    DELIVERED
                  </span>

                  <span className="myorders-dot myorders-dot--delivered"></span>
                </div>

                <strong>{counts.delivered}</strong>
              </div>

              <div className="myorders-summary-card">
                <div className="myorders-summary-top">
                  <span className="myorders-summary-label">
                    CANCELLED
                  </span>

                  <span className="myorders-dot myorders-dot--cancelled"></span>
                </div>

                <strong>{counts.cancelled}</strong>
              </div>

            </div>

            {/* Toolbar */}
            <div className="myorders-toolbar">

              <div className="myorders-tabs">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    className={`myorders-tab ${
                      activeTab === tab.key
                        ? "myorders-tab--active"
                        : ""
                    }`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label} {counts[tab.key]}
                  </button>
                ))}
              </div>

              <div className="myorders-search">
                <i className="fa-solid fa-magnifying-glass"></i>

                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />
              </div>

            </div>

            {/* Orders table */}
            <div className="myorders-table-wrap">
              <table className="myorders-table">

                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleOrders.map((order) => {
                    const primaryItem = order.items?.[0] || {};
                    const extraItems =
                      (order.items?.length || 0) - 1;

                    return (
                      <tr key={order._id}>

                        <td className="myorders-cell-id">
                          {orderNumber(order)}
                        </td>

                        <td className="myorders-cell-date">
                          {formatDate(order.placedAt)}
                        </td>

                        <td className="myorders-cell-product">
                          {primaryItem.title || "Product"}

                          {extraItems > 0 && (
                            <span className="myorders-cell-extra">
                              {" "}
                              +{extraItems} more
                            </span>
                          )}
                        </td>

                        <td className="myorders-cell-category">
                          {primaryItem.category || "—"}
                        </td>

                        <td className="myorders-cell-qty">
                          {totalQty(order)}
                        </td>

                        <td>
                          <span
                            className={`myorders-status myorders-status--${statusKey(
                              order.orderStatus
                            )}`}
                          >
                            {formatStatus(order.orderStatus)}
                          </span>
                        </td>

                        <td className="myorders-cell-total">
                          {currency(order.total)}
                        </td>

                      </tr>
                    );
                  })}

                  {visibleOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="myorders-table-empty"
                      >
                        No orders match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </>
        )}

      </div>
    </main>
  );
}

export default Myorders;