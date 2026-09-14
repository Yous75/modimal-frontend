import React, { useEffect, useMemo, useState } from "react";

import {
  getAdminStats,
  getAdminOrders,
  updateOrderStatus,
  createProduct,
} from "../../api/admin";

import { getProducts } from "../../api/products";

import "./Dashboard.css";

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = ["Dashboard", "Orders", "Products"];

/* ------------------------------------------------------------------ */
/* Product categories                                                  */
/* ------------------------------------------------------------------ */

const PRODUCT_CATEGORIES = [
  "All",
  "Dresses",
  "Blouses & Tops",
  "Outerwear",
  "Skirts",
  "Trousers",
];

/* ------------------------------------------------------------------ */
/* Temporary fallback order data                                       */
/* ------------------------------------------------------------------ */

const ORDERS = [
  {
    id: "#4821",
    date: "Aug 23, 2026",
    customer: "Yousra Merabet",
    product: "Silk Wrap Dress",
    category: "Dresses",
    qty: 1,
    orderStatus: "SHIPPED",
    total: 148,
  },
  {
    id: "#4820",
    date: "Aug 23, 2026",
    customer: "Yasmine Amrani",
    product: "Linen Blazer Set",
    category: "Sets",
    qty: 1,
    orderStatus: "PROCESSING",
    total: 224,
  },
  {
    id: "#4819",
    date: "Aug 22, 2026",
    customer: "Meriem Benali",
    product: "Cashmere Turtleneck",
    category: "Tops",
    qty: 2,
    orderStatus: "DELIVERED",
    total: 185,
  },
  {
    id: "#4818",
    date: "Aug 22, 2026",
    customer: "Amine Belkacem",
    product: "Pleated Midi Skirt",
    category: "Skirts",
    qty: 1,
    orderStatus: "DELIVERED",
    total: 96,
  },
  {
    id: "#4817",
    date: "Aug 21, 2026",
    customer: "Chiraz Haddad",
    product: "Wool Coat",
    category: "Outerwear",
    qty: 1,
    orderStatus: "CANCELLED",
    total: 312,
  },
  {
    id: "#4816",
    date: "Aug 21, 2026",
    customer: "Lyna Zerrouki",
    product: "Cotton Slip Dress",
    category: "Dresses",
    qty: 1,
    orderStatus: "SHIPPED",
    total: 78,
  },
  {
    id: "#4815",
    date: "Aug 20, 2026",
    customer: "Sarah Khelifi",
    product: "Ribbed Knit Top",
    category: "Tops",
    qty: 3,
    orderStatus: "DELIVERED",
    total: 64,
  },
  {
    id: "#4814",
    date: "Aug 20, 2026",
    customer: "Fatima Zohra Brahimi",
    product: "Tailored Trousers",
    category: "Trousers",
    qty: 1,
    orderStatus: "REFUNDED",
    total: 134,
  },
  {
    id: "#4813",
    date: "Aug 19, 2026",
    customer: "Nour El Houda Saidi",
    product: "Linen Wide Leg Pants",
    category: "Trousers",
    qty: 1,
    orderStatus: "DELIVERED",
    total: 112,
  },
  {
    id: "#4812",
    date: "Aug 19, 2026",
    customer: "Imene Boudiaf",
    product: "Silk Cami Set",
    category: "Sets",
    qty: 1,
    orderStatus: "SHIPPED",
    total: 168,
  },
];

const ORDER_FILTERS = [
  "All",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
];

/* ------------------------------------------------------------------ */
/* Chart data                                                          */
/* ------------------------------------------------------------------ */

const REVENUE_MONTHS = [
  { label: "Sep", value: 51000 },
  { label: "Oct", value: 55000 },
  { label: "Nov", value: 60000 },
  { label: "Dec", value: 72000 },
  { label: "Jan", value: 49000 },
  { label: "Feb", value: 53000 },
  { label: "Mar", value: 58000 },
  { label: "Apr", value: 64000 },
  { label: "May", value: 69000 },
  { label: "Jun", value: 79000 },
  { label: "Jul", value: 74000 },
  { label: "Aug", value: 84320 },
];

const CHART_DURATIONS = {
  "3M": 3,
  "6M": 6,
  "1Y": 12,
};

const TOP_CATEGORIES = [
  { label: "Dresses", pct: 38 },
  { label: "Tops", pct: 27 },
  { label: "Outerwear", pct: 19 },
  { label: "Sets", pct: 16 },
];

/* ------------------------------------------------------------------ */
/* Default metrics                                                     */
/* ------------------------------------------------------------------ */

const METRICS = [
  {
    label: "Total Revenue",
    value: "$84,320",
    delta: "+12.4%",
    positive: true,
  },
  {
    label: "Orders",
    value: "1,248",
    delta: "+8.1%",
    positive: true,
  },
  {
    label: "Avg. Order Value",
    value: "$67.56",
    delta: "-2.3%",
    positive: false,
  },
  {
    label: "New Customers",
    value: "342",
    delta: "+18.7%",
    positive: true,
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getOrderStatus(order) {
  return String(
    order?.orderStatus ||
      order?.status ||
      "PENDING"
  ).toUpperCase();
}

function StatusPill({ status }) {
  const safeStatus = status || "UNKNOWN";

  const cls = safeStatus
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-pill status-${cls}`}>
      {safeStatus}
    </span>
  );
}

function DeltaPill({ delta, positive }) {
  return (
    <span
      className={`delta-pill ${
        positive
          ? "delta-up"
          : "delta-down"
      }`}
    >
      {delta}
    </span>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="search-box">
      <span
        className="search-icon"
        aria-hidden="true"
      >
        ⚲
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

function Sidebar({
  activeView,
  setActiveView,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        modimal.
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            className={`sidebar-nav-item ${
              activeView === item
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveView(item)
            }
          >
            {item.toUpperCase()}
          </button>
        ))}
      </nav>

      <div className="sidebar-profile">
        <div className="avatar-badge">
          YA
        </div>

        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">
            Yousra A.
          </div>

          <div className="sidebar-profile-role">
            ADMIN
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard metrics                                                   */
/* ------------------------------------------------------------------ */

function MetricsRow({ stats }) {
  const metrics = METRICS.map(
    (metric) => {
      if (!stats) return metric;

      if (
        metric.label ===
        "Total Revenue"
      ) {
        const value =
          stats.totalRevenue ??
          stats.revenue ??
          stats.totalSales;

        if (value !== undefined) {
          return {
            ...metric,
            value: `$${Number(
              value
            ).toLocaleString()}`,
          };
        }
      }

      if (metric.label === "Orders") {
        const value =
          stats.totalOrders ??
          stats.ordersCount ??
          stats.orders;

        if (value !== undefined) {
          return {
            ...metric,
            value: Number(
              value
            ).toLocaleString(),
          };
        }
      }

      if (
        metric.label ===
        "New Customers"
      ) {
        const value =
          stats.newCustomers ??
          stats.customersCount ??
          stats.totalCustomers;

        if (value !== undefined) {
          return {
            ...metric,
            value: Number(
              value
            ).toLocaleString(),
          };
        }
      }

      return metric;
    }
  );

  return (
    <div className="metrics-row">
      {metrics.map((m) => (
        <div
          className="card metric-card"
          key={m.label}
        >
          <div className="metric-label">
            {m.label.toUpperCase()}
          </div>

          <div className="metric-value">
            {m.value}
          </div>

          <div className="metric-footer">
            <DeltaPill
              delta={m.delta}
              positive={m.positive}
            />

            <span className="metric-footer-text">
              vs last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Revenue                                                             */
/* ------------------------------------------------------------------ */

function RevenueOverview({
  duration,
  setDuration,
}) {
  const monthsToShow =
    CHART_DURATIONS[duration];

  const visible =
    REVENUE_MONTHS.slice(
      -monthsToShow
    );

  const max = Math.max(
    ...REVENUE_MONTHS.map(
      (m) => m.value
    )
  );

  return (
    <div className="card revenue-card">
      <div className="revenue-header">
        <div>
          <div className="section-eyebrow">
            REVENUE
          </div>

          <h2 className="section-title">
            Monthly Overview
          </h2>
        </div>

        <div className="duration-toggle">
          {Object.keys(
            CHART_DURATIONS
          ).map((d) => (
            <button
              key={d}
              className={`duration-btn ${
                duration === d
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setDuration(d)
              }
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="bar-chart">
        {visible.map((m, i) => {
          const isLast =
            i ===
            visible.length - 1;

          const heightPct =
            Math.max(
              (m.value / max) * 100,
              6
            );

          return (
            <div
              className="bar-column"
              key={
                m.label + i
              }
            >
              <div className="bar-track">
                <div
                  className={`bar-fill ${
                    isLast
                      ? "bar-fill-active"
                      : ""
                  }`}
                  style={{
                    height: `${heightPct}%`,
                  }}
                  title={`$${m.value.toLocaleString()}`}
                />
              </div>

              <div className="bar-label">
                {m.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Top category                                                        */
/* ------------------------------------------------------------------ */

function TopCategoryPanel() {
  return (
    <div className="card top-category-card">
      <div className="section-eyebrow eyebrow-inverse">
        TOP CATEGORY
      </div>

      <h2 className="section-title title-inverse">
        Dresses
      </h2>

      <div className="top-category-sub">
        38% of total sales
      </div>

      <div className="category-list">
        {TOP_CATEGORIES.map((c) => (
          <div
            className="category-row"
            key={c.label}
          >
            <div className="category-row-labels">
              <span>{c.label}</span>
              <span>{c.pct}%</span>
            </div>

            <div className="category-bar-track">
              <div
                className="category-bar-fill"
                style={{
                  width: `${c.pct}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Orders table                                                        */
/* ------------------------------------------------------------------ */

function OrdersTable({
  orders,
  showCategory,
  onStatusUpdate,
}) {
  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  const handleStatusChange = async (
    order,
    newStatus
  ) => {
    const orderId =
      order._id || order.id;

    if (!orderId) {
      return;
    }

    try {
      setUpdatingOrderId(orderId);

      await onStatusUpdate(
        orderId,
        newStatus
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>ORDER</th>

            {showCategory && (
              <th>DATE</th>
            )}

            <th>CUSTOMER</th>

            <th>PRODUCT</th>

            {showCategory && (
              <th>CATEGORY</th>
            )}

            {showCategory && (
              <th>QTY</th>
            )}

            <th>STATUS</th>

            <th className="align-right">
              TOTAL
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o, index) => {
            const status =
              getOrderStatus(o);

            const orderId =
              o._id || o.id;

            return (
              <tr
                key={
                  orderId ||
                  `order-${index}`
                }
              >
                <td className="order-id">
                  {o.id ||
                    o._id}
                </td>

                {showCategory && (
                  <td className="muted">
                    {o.date
                      ? o.date
                      : o.placedAt
                      ? new Date(
                          o.placedAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                )}

                <td className="link-text">
                  {o.customer ||
                    o.user?.name ||
                    `${o.shippingAddress?.firstName || ""} ${
                      o.shippingAddress?.lastName || ""
                    }`.trim() ||
                    o.email ||
                    "-"}
                </td>

                <td>
                  {o.product ||
                    o.productName ||
                    o.items?.[0]?.title ||
                    o.items?.[0]?.product?.title ||
                    "-"}
                </td>

                {showCategory && (
                  <td className="muted">
                    {o.category ||
                      o.items?.[0]?.product?.category ||
                      "-"}
                  </td>
                )}

                {showCategory && (
                  <td>
                    {o.qty ||
                      o.quantity ||
                      o.items?.[0]?.qty ||
                      o.items?.[0]?.quantity ||
                      1}
                  </td>
                )}

                <td>
                  <div className="order-status-control">
                    <StatusPill
                      status={status}
                    />

                    {showCategory &&
                      onStatusUpdate && (
                        <select
                          value={status}
                          disabled={
                            updatingOrderId ===
                            orderId
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              o,
                              e.target.value
                            )
                          }
                          className="order-status-select"
                        >
                          <option value="PENDING">
                            PENDING
                          </option>

                          <option value="SHIPPED">
                            SHIPPED
                          </option>

                          <option value="DELIVERED">
                            DELIVERED
                          </option>

                          <option value="CANCELLED">
                            CANCELLED
                          </option>
                        </select>
                      )}
                  </div>
                </td>

                <td className="align-right strong">
                  $
                  {Number(
                    o.total ??
                      o.totalPrice ??
                      0
                  ).toLocaleString()}
                </td>
              </tr>
            );
          })}

          {orders.length === 0 && (
            <tr>
              <td
                colSpan={
                  showCategory
                    ? 8
                    : 5
                }
                className="empty-row"
              >
                No orders match this
                filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard view                                                      */
/* ------------------------------------------------------------------ */

function DashboardView({
  stats,
  loading,
  error,
}) {
  const [duration, setDuration] =
    useState("6M");

  const recentOrders =
    Array.isArray(
      stats?.recentOrders
    )
      ? stats.recentOrders.slice(
          0,
          5
        )
      : ORDERS.slice(0, 5);

  return (
    <>
      <PageHeader
        eyebrow="DASHBOARD"
        title="August 2026"
      />

      {loading && (
        <p className="category-status">
          Loading dashboard
          statistics…
        </p>
      )}

      {error && (
        <p className="category-status">
          {error}
        </p>
      )}

      <MetricsRow
        stats={stats}
      />

      <div className="revenue-grid">
        <RevenueOverview
          duration={duration}
          setDuration={setDuration}
        />

        <TopCategoryPanel />
      </div>

      <div className="card orders-card">
        <h2 className="section-title table-title">
          Recent Orders
        </h2>

        <OrdersTable
          orders={recentOrders}
          showCategory={false}
        />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Order helpers                                                       */
/* ------------------------------------------------------------------ */

function statusCount(
  orders,
  status
) {
  return orders.filter(
    (o) =>
      getOrderStatus(o) ===
      status.toUpperCase()
  ).length;
}

/* ------------------------------------------------------------------ */
/* Orders view                                                         */
/* ------------------------------------------------------------------ */

function OrdersView({
  orders,
  loading,
  error,
  onStatusUpdate,
}) {
  const [filter, setFilter] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const filtered = useMemo(() => {
    const q =
      search.trim().toLowerCase();

    return orders.filter((o) => {
      const currentStatus =
        getOrderStatus(o);

      const matchesFilter =
        filter === "All" ||
        currentStatus ===
          filter.toUpperCase();

      const customer =
        o.customer ||
        o.user?.name ||
        `${o.shippingAddress?.firstName || ""} ${
          o.shippingAddress?.lastName || ""
        }` ||
        o.email ||
        "";

      const product =
        o.product ||
        o.productName ||
        o.items?.[0]?.title ||
        o.items?.[0]?.product?.title ||
        "";

      const matchesSearch =
        q === "" ||
        customer
          .toLowerCase()
          .includes(q) ||
        product
          .toLowerCase()
          .includes(q);

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [
    orders,
    filter,
    search,
  ]);

  const summary = [
    {
      label: "Processing",
      count: statusCount(
        orders,
        "Processing"
      ),
    },
    {
      label: "Shipped",
      count: statusCount(
        orders,
        "Shipped"
      ),
    },
    {
      label: "Delivered",
      count: statusCount(
        orders,
        "Delivered"
      ),
    },
    {
      label: "Cancelled",
      count: statusCount(
        orders,
        "Cancelled"
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="ORDERS"
        title={`${orders.length} total`}
        action={
          <button className="btn-primary">
            + EXPORT
          </button>
        }
      />

      <div className="status-summary-row">
        {summary.map((s) => (
          <div
            className="card status-summary-card"
            key={s.label}
          >
            <div className="status-summary-header">
              <span>
                {s.label.toUpperCase()}
              </span>

              <span
                className={`status-dot dot-${s.label.toLowerCase()}`}
              />
            </div>

            <div className="status-summary-count">
              {s.count}
            </div>
          </div>
        ))}
      </div>

      <div className="card orders-card">
        {loading && (
          <p className="category-status">
            Loading orders…
          </p>
        )}

        {error && (
          <p className="category-status">
            {error}
          </p>
        )}

        <div className="filter-bar">
          <div className="pill-filters">
            {ORDER_FILTERS.map((f) => {
              const count =
                f === "All"
                  ? orders.length
                  : statusCount(
                      orders,
                      f
                    );

              return (
                <button
                  key={f}
                  className={`pill-filter ${
                    filter === f
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setFilter(f)
                  }
                >
                  {f}

                  <span className="pill-filter-count">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search orders..."
          />
        </div>

        <OrdersTable
          orders={filtered}
          showCategory={true}
          onStatusUpdate={
            onStatusUpdate
          }
        />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Product card                                                        */
/* ------------------------------------------------------------------ */

function ProductCard({
  product,
}) {
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        <span
          className={`product-status-badge badge-${product.status
            .toLowerCase()
            .replace(
              /\s+/g,
              "-"
            )}`}
        >
          {product.status}
        </span>
      </div>

      <div className="product-info">
        <div className="product-category">
          {product.category.toUpperCase()}
        </div>

        <div className="product-name">
          {product.name}
        </div>

        <div className="product-price-row">
          <span className="product-price">
            ${product.price}
          </span>

          <span className="product-stock">
            {product.stock} in stock
          </span>
        </div>

        <div className="product-sold-row">
          <span className="product-sold-label">
            {product.sold} sold
          </span>

          <div className="product-progress-track">
            <div
              className="product-progress-fill"
              style={{
                width: `${Math.min(
                  (product.sold /
                    140) *
                    100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Add Product Form                                                    */
/* ------------------------------------------------------------------ */

function AddProductForm({
  onClose,
  onProductCreated,
}) {
  const [form, setForm] =
    useState({
      title: "",
      subtitle: "",
      description: "",
      category:
        "dresses-jumpsuits",
      price: "",
      image: "",
      colorName: "",
      colorHex: "",
      size: "S",
      sizeStock: "",
      fabric: "",
      tags: "",
      status: "ACTIVE",
      isPlusSize: false,
    });

  const [colors, setColors] =
    useState([]);

  const [sizes, setSizes] =
    useState([]);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const addColor = () => {
    const name =
      form.colorName.trim();

    const hex =
      form.colorHex.trim();

    if (!name || !hex) {
      setError(
        "Please enter both a color name and HEX value."
      );
      return;
    }

    setColors((prev) => [
      ...prev,
      {
        name,
        hex,
      },
    ]);

    setForm((prev) => ({
      ...prev,
      colorName: "",
      colorHex: "",
    }));

    setError("");
  };

  const removeColor = (
    index
  ) => {
    setColors((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  const addSize = () => {
    const size =
      form.size.trim();

    const stock = Number(
      form.sizeStock
    );

    if (
      !size ||
      form.sizeStock === "" ||
      stock < 0
    ) {
      setError(
        "Please enter a valid size and stock amount."
      );
      return;
    }

    setSizes((prev) => [
      ...prev,
      {
        size,
        stock,
      },
    ]);

    setForm((prev) => ({
      ...prev,
      size: "",
      sizeStock: "",
    }));

    setError("");
  };

  const removeSize = (
    index
  ) => {
    setSizes((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      if (
        !form.title.trim()
      ) {
        setError(
          "Title is required."
        );
        return;
      }

      if (!form.category) {
        setError(
          "Category is required."
        );
        return;
      }

      if (
        form.price === "" ||
        Number(form.price) < 0
      ) {
        setError(
          "Please enter a valid price."
        );
        return;
      }

      try {
        setSaving(true);

        const productData = {
          title:
            form.title.trim(),

          subtitle:
            form.subtitle.trim(),

          description:
            form.description.trim(),

          category:
            form.category,

          price: Number(
            form.price
          ),

          images:
            form.image.trim()
              ? [
                  form.image.trim(),
                ]
              : [],

          colors,

          sizes,

          fabric:
            form.fabric.trim(),

          tags: form.tags
            .split(",")
            .map((tag) =>
              tag.trim()
            )
            .filter(Boolean),

          status: form.status,

          isPlusSize:
            form.isPlusSize,
        };

        const createdProduct =
          await createProduct(
            productData
          );

onProductCreated(
          createdProduct
        );

        onClose();
      } catch (err) {
setError(
          err.message ||
            "Failed to create product."
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <div className="add-product-overlay">
      <div className="add-product-modal">
        <div className="add-product-header">
          <div>
            <div className="section-eyebrow">
              PRODUCTS
            </div>

            <h2 className="section-title">
              Add Product
            </h2>
          </div>

          <button
            type="button"
            className="add-product-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="add-product-form"
        >
          {/* BASIC INFORMATION */}

          <div className="form-section">
            <h3>
              Basic Information
            </h3>

            <div className="form-grid">
              <label className="form-field">
                <span>
                  Title *
                </span>

                <input
                  type="text"
                  name="title"
                  value={
                    form.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Silk Wrap Dress"
                />
              </label>

              <label className="form-field">
                <span>
                  Subtitle
                </span>

                <input
                  type="text"
                  name="subtitle"
                  value={
                    form.subtitle
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Elegant everyday wear"
                />
              </label>
            </div>

            <label className="form-field">
              <span>
                Description
              </span>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                placeholder="Describe the product..."
                rows="4"
              />
            </label>
          </div>

          {/* PRODUCT DETAILS */}

          <div className="form-section">
            <h3>
              Product Details
            </h3>

            <div className="form-grid">
              <label className="form-field">
                <span>
                  Category *
                </span>

                <select
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="dresses-jumpsuits">
                    Dresses &
                    Jumpsuits
                  </option>

                  <option value="blouses-tops">
                    Blouses & Tops
                  </option>

                  <option value="pants">
                    Pants
                  </option>

                  <option value="outerwear-jackets">
                    Outerwear &
                    Jackets
                  </option>

                  <option value="tees">
                    Tees
                  </option>

                  <option value="shorts-skirts">
                    Shorts &
                    Skirts
                  </option>
                </select>
              </label>

              <label className="form-field">
                <span>
                  Price *
                </span>

                <input
                  type="number"
                  name="price"
                  value={
                    form.price
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="148"
                  min="0"
                  step="0.01"
                />
              </label>

              <label className="form-field">
                <span>
                  Fabric
                </span>

                <input
                  type="text"
                  name="fabric"
                  value={
                    form.fabric
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Silk"
                />
              </label>

              <label className="form-field">
                <span>
                  Status
                </span>

                <select
                  name="status"
                  value={
                    form.status
                  }
                  onChange={
                    handleChange
                  }
                >
                  <option value="ACTIVE">
                    ACTIVE
                  </option>

                  <option value="INACTIVE">
                    INACTIVE
                  </option>
                </select>
              </label>
            </div>
          </div>

          {/* IMAGE */}

          <div className="form-section">
            <h3>Image</h3>

            <label className="form-field">
              <span>
                Image URL
              </span>

              <input
                type="url"
                name="image"
                value={
                  form.image
                }
                onChange={
                  handleChange
                }
                placeholder="https://example.com/product.jpg"
              />
            </label>
          </div>

          {/* COLORS */}

          <div className="form-section">
            <h3>Colors</h3>

            <div className="add-row">
              <input
                type="text"
                name="colorName"
                value={
                  form.colorName
                }
                onChange={
                  handleChange
                }
                placeholder="Color name"
              />

              <input
                type="text"
                name="colorHex"
                value={
                  form.colorHex
                }
                onChange={
                  handleChange
                }
                placeholder="#000000"
              />

              <button
                type="button"
                className="btn-secondary"
                onClick={
                  addColor
                }
              >
                + ADD COLOR
              </button>
            </div>

            {colors.length >
              0 && (
              <div className="form-items-list">
                {colors.map(
                  (
                    color,
                    index
                  ) => (
                    <div
                      className="form-item"
                      key={`${color.name}-${index}`}
                    >
                      <span
                        className="color-preview"
                        style={{
                          backgroundColor:
                            color.hex,
                        }}
                      />

                      <span>
                        {
                          color.name
                        }{" "}
                        (
                        {
                          color.hex
                        }
                        )
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeColor(
                            index
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* SIZES */}

          <div className="form-section">
            <h3>
              Sizes & Stock
            </h3>

            <div className="add-row">
              <input
                type="text"
                name="size"
                value={
                  form.size
                }
                onChange={
                  handleChange
                }
                placeholder="S"
              />

              <input
                type="number"
                name="sizeStock"
                value={
                  form.sizeStock
                }
                onChange={
                  handleChange
                }
                placeholder="Stock"
                min="0"
              />

              <button
                type="button"
                className="btn-secondary"
                onClick={
                  addSize
                }
              >
                + ADD SIZE
              </button>
            </div>

            {sizes.length >
              0 && (
              <div className="form-items-list">
                {sizes.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="form-item"
                      key={`${item.size}-${index}`}
                    >
                      <span>
                        Size:{" "}
                        <strong>
                          {
                            item.size
                          }
                        </strong>
                      </span>

                      <span>
                        Stock:{" "}
                        <strong>
                          {
                            item.stock
                          }
                        </strong>
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeSize(
                            index
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* TAGS */}

          <div className="form-section">
            <h3>Tags</h3>

            <label className="form-field">
              <span>
                Tags
              </span>

              <input
                type="text"
                name="tags"
                value={
                  form.tags
                }
                onChange={
                  handleChange
                }
                placeholder="Best Seller, New In"
              />

              <small>
                Separate multiple
                tags with commas.
              </small>
            </label>
          </div>

          {/* PLUS SIZE */}

          <div className="form-section form-checkbox-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPlusSize"
                checked={
                  form.isPlusSize
                }
                onChange={
                  handleChange
                }
              />

              <span>
                Plus Size
              </span>
            </label>
          </div>

          {/* ERROR */}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          {/* BUTTONS */}

          <div className="add-product-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              CANCEL
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving
                ? "CREATING..."
                : "CREATE PRODUCT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Products view                                                       */
/* ------------------------------------------------------------------ */

function ProductsView() {
  const [category, setCategory] =
    useState("All");

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showAddProduct, setShowAddProduct] =
    useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts =
    async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getProducts();

setProducts(
          Array.isArray(data)
            ? data
            : data?.products || []
        );
      } catch (err) {
setError(
          err.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

  const handleProductCreated =
    (createdProduct) => {
      setProducts((prev) => [
        createdProduct,
        ...prev,
      ]);

      setCategory("All");
    };

  const filtered = useMemo(() => {
    if (
      category === "All"
    ) {
      return products;
    }

    return products.filter(
      (product) =>
        product.category ===
        category
    );
  }, [
    category,
    products,
  ]);

  const active =
    products.filter(
      (p) =>
        p.status ===
        "ACTIVE"
    ).length;

  const lowStock =
    products.filter((p) => {
      if (
        !p.sizes ||
        p.sizes.length === 0
      ) {
        return false;
      }

      const totalStock =
        p.sizes.reduce(
          (
            sum,
            size
          ) =>
            sum +
            Number(
              size.stock ||
                0
            ),
          0
        );

      return (
        totalStock > 0 &&
        totalStock <= 10
      );
    }).length;

  const outOfStock =
    products.filter((p) => {
      if (
        !p.sizes ||
        p.sizes.length === 0
      ) {
        return false;
      }

      const totalStock =
        p.sizes.reduce(
          (
            sum,
            size
          ) =>
            sum +
            Number(
              size.stock ||
                0
            ),
          0
        );

      return (
        totalStock === 0
      );
    }).length;

  const summary = [
    {
      label:
        "Total Products",
      value:
        products.length,
    },
    {
      label: "Active",
      value: active,
    },
    {
      label:
        "Low Stock",
      value: lowStock,
    },
    {
      label:
        "Out of Stock",
      value:
        outOfStock,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="PRODUCTS"
        title={`${products.length} items`}
        action={
          <button
            className="btn-primary"
            onClick={() =>
              setShowAddProduct(
                true
              )
            }
          >
            + ADD PRODUCT
          </button>
        }
      />

      {loading && (
        <p className="category-status">
          Loading products…
        </p>
      )}

      {error && (
        <p className="category-status">
          {error}
        </p>
      )}

      {!loading &&
        !error && (
          <>
            <div className="status-summary-row">
              {summary.map(
                (s) => (
                  <div
                    className="card status-summary-card"
                    key={
                      s.label
                    }
                  >
                    <div className="status-summary-header">
                      <span>
                        {s.label.toUpperCase()}
                      </span>
                    </div>

                    <div className="status-summary-count">
                      {
                        s.value
                      }
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="category-tabs">
              <button
                className={`category-tab ${
                  category ===
                  "All"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setCategory(
                    "All"
                  )
                }
              >
                All
              </button>

              {PRODUCT_CATEGORIES
                .filter(
                  (c) =>
                    c !==
                    "All"
                )
                .map((c) => (
                  <button
                    key={c}
                    className={`category-tab ${
                      category ===
                      ({
                        Dresses:
                          "dresses-jumpsuits",
                        "Blouses & Tops":
                          "blouses-tops",
                        Outerwear:
                          "outerwear-jackets",
                        Skirts:
                          "shorts-skirts",
                        Trousers:
                          "pants",
                      }[
                        c
                      ] || c)
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      const categoryMap =
                        {
                          Dresses:
                            "dresses-jumpsuits",
                          "Blouses & Tops":
                            "blouses-tops",
                          Outerwear:
                            "outerwear-jackets",
                          Skirts:
                            "shorts-skirts",
                          Trousers:
                            "pants",
                        };

                      setCategory(
                        categoryMap[
                          c
                        ] || c
                      );
                    }}
                  >
                    {c}
                  </button>
                ))}
            </div>

            <div className="product-grid">
              {filtered.map(
                (p) => {
                  const totalStock =
                    p.sizes?.reduce(
                      (
                        sum,
                        size
                      ) =>
                        sum +
                        Number(
                          size.stock ||
                            0
                        ),
                      0
                    ) || 0;

                  const status =
                    p.status ||
                    (totalStock ===
                    0
                      ? "OUT OF STOCK"
                      : totalStock <=
                        10
                      ? "LOW STOCK"
                      : "ACTIVE");

                  return (
                    <ProductCard
                      key={
                        p._id
                      }
                      product={{
                        id: p._id,
                        name:
                          p.title,
                        category:
                          p.category,
                        price:
                          p.price,
                        stock:
                          totalStock,
                        sold: 0,
                        status,
                        image:
                          p.images?.[0],
                      }}
                    />
                  );
                }
              )}

              {filtered.length ===
                0 && (
                <div className="empty-row">
                  No products in
                  this category.
                </div>
              )}
            </div>
          </>
        )}

      {showAddProduct && (
        <AddProductForm
          onClose={() =>
            setShowAddProduct(
              false
            )
          }
          onProductCreated={
            handleProductCreated
          }
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Shared page header                                                  */
/* ------------------------------------------------------------------ */

function PageHeader({
  eyebrow,
  title,
  action,
}) {
  return (
    <div className="page-header">
      <div className="page-header-title">
        <span className="page-header-eyebrow">
          {eyebrow}
        </span>

        <span className="page-header-dot">
          ·
        </span>

        <span className="page-header-main">
          {title}
        </span>
      </div>

      <div className="page-header-actions">
        {action || (
          <SearchBox
            value=""
            onChange={() => {}}
            placeholder="Search"
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root Dashboard component                                            */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const [activeView, setActiveView] =
    useState("Dashboard");

  /* ------------------------- Stats ------------------------- */

  const [stats, setStats] =
    useState(null);

  const [statsLoading, setStatsLoading] =
    useState(true);

  const [statsError, setStatsError] =
    useState("");

  /* ------------------------- Orders ------------------------- */

  const [orders, setOrders] =
    useState([]);

  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [ordersError, setOrdersError] =
    useState("");

  /* ---------------------------------------------------------- */
  /* Load dashboard statistics                                  */
  /* ---------------------------------------------------------- */

  useEffect(() => {
    if (
      activeView !==
      "Dashboard"
    ) {
      return;
    }

    setStatsLoading(true);
    setStatsError("");

    getAdminStats()
      .then((data) => {
setStats(data);
      })
      .catch((err) => {
setStatsError(
          err.message ||
            "Failed to load dashboard statistics."
        );
      })
      .finally(() => {
        setStatsLoading(false);
      });
  }, [activeView]);

  /* ---------------------------------------------------------- */
  /* Load admin orders                                          */
  /* ---------------------------------------------------------- */

  useEffect(() => {
    if (
      activeView !==
      "Orders"
    ) {
      return;
    }

    setOrdersLoading(true);
    setOrdersError("");

    getAdminOrders()
      .then((data) => {
const receivedOrders =
          Array.isArray(data)
            ? data
            : Array.isArray(
                data?.orders
              )
            ? data.orders
            : [];

        setOrders(
          receivedOrders
        );
      })
      .catch((err) => {
setOrdersError(
          err.message ||
            "Failed to load orders."
        );

        setOrders([]);
      })
      .finally(() => {
        setOrdersLoading(false);
      });
  }, [activeView]);

  /* ---------------------------------------------------------- */
  /* Update order status                                        */
  /* ---------------------------------------------------------- */

  const handleStatusUpdate =
    async (
      orderId,
      newStatus
    ) => {
      try {
        const updatedOrder =
          await updateOrderStatus(
            orderId,
            newStatus
          );

        setOrders((prev) =>
          prev.map(
            (order) =>
              (
                order._id ||
                order.id
              ) === orderId
                ? updatedOrder
                : order
          )
        );
      } catch (err) {
alert(
          err.message ||
            "Failed to update order status."
        );

        throw err;
      }
    };

  return (
    <div className="modimal-app">
      <Sidebar
        activeView={
          activeView
        }
        setActiveView={
          setActiveView
        }
      />

      <main className="main-content">
        {activeView ===
          "Dashboard" && (
          <DashboardView
            stats={stats}
            loading={
              statsLoading
            }
            error={
              statsError
            }
          />
        )}

        {activeView ===
          "Orders" && (
          <OrdersView
            orders={orders}
            loading={
              ordersLoading
            }
            error={
              ordersError
            }
            onStatusUpdate={
              handleStatusUpdate
            }
          />
        )}

        {activeView ===
          "Products" && (
          <ProductsView />
        )}
      </main>
    </div>
  );
}