import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Customerwish.css";
import { getWishlist } from "../../api/wishlist";
import { addToCart } from "../../api/cart";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../sidebar/Sidebar";

// Formats the "added" date in a readable way.
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

function isInStock(item) {
  if (typeof item.inStock === "boolean") return item.inStock;
  return String(item.availability || "").toUpperCase() !== "OUT_OF_STOCK";
}

function Customerwish() {
  const { isLoggedIn } = useAuth();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingAll, setIsAddingAll] = useState(false);

  // Loads the logged-in customer's wishlist from the backend.
  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoading(false);
      return;
    }

    const loadWishlist = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await getWishlist();

        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        setLoadError(
          error?.message || "Couldn't load your wishlist right now."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [isLoggedIn]);

  // Top summary numbers: saved / in stock / out of stock / total value.
  const stats = useMemo(() => {
    const inStockCount = items.filter(isInStock).length;

    return {
      saved: items.length,
      inStock: inStockCount,
      outOfStock: items.length - inStockCount,
      totalValue: items.reduce((sum, item) => sum + Number(item.price || 0), 0),
    };
  }, [items]);

  // Category tabs are built from whatever categories are actually present.
  const categoryTabs = useMemo(() => {
    const counts = new Map();

    items.forEach((item) => {
      const category = item.category || "Other";
      counts.set(category, (counts.get(category) || 0) + 1);
    });

    return Array.from(counts.entries()).map(([category, count]) => ({
      key: category,
      label: category,
      count,
    }));
  }, [items]);

  // Applies the active category tab and the search box to the item list.
  const visibleItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      if (activeTab !== "all" && (item.category || "Other") !== activeTab) {
        return false;
      }

      if (!term) return true;

      const haystack = `${item.title || ""} ${item.category || ""}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [items, activeTab, searchTerm]);

  // Adds every in-stock wishlist item to the shopping bag.
  const handleAddAllToBag = async () => {
    const inStockItems = items.filter(isInStock);
    if (inStockItems.length === 0) return;

    try {
      setIsAddingAll(true);
      await Promise.all(
        inStockItems.map((item) =>
          addToCart({ productId: item.productId || item._id, qty: 1 })
        )
      );
    } catch (error) {
      setLoadError(error?.message || "Couldn't add everything to your bag.");
    } finally {
      setIsAddingAll(false);
    }
  };

  // Customer must be logged in to see their wishlist.
  if (!isLoggedIn) {
    return (
      <div className="app-shell">
        <Sidebar />

        <main className="customerwish-page">
          <div className="customerwish-login-message">
            <div className="customerwish-login-icon">
              <i className="fa-regular fa-heart"></i>
            </div>

            <h1>Sign In To View Your Wishlist</h1>

            <p>
              Please sign in to your Modimal account to view the
              items you've saved.
            </p>

            <Link to="/" className="customerwish-primary-btn">
              Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="customerwish-page">
        <div className="customerwish-container">

          {/* Page heading */}
          <header className="customerwish-header">
            <div className="customerwish-title-group">
              <h1>My Wishlist</h1>
              <span className="customerwish-count">{items.length} items</span>
            </div>

            <button
              type="button"
              className="customerwish-add-all-btn"
              onClick={handleAddAllToBag}
              disabled={isLoading || isAddingAll || stats.inStock === 0}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              {isAddingAll ? "Adding..." : "Add All To Bag"}
            </button>
          </header>

          {/* Loading state */}
          {isLoading && (
            <div className="customerwish-state">
              <div className="customerwish-spinner"></div>
              <p>Loading your wishlist...</p>
            </div>
          )}

          {/* Error state */}
          {!isLoading && loadError && (
            <div className="customerwish-state customerwish-state--error">
              <div className="customerwish-state-icon">
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>

              <h2>Couldn't Load Your Wishlist</h2>

              <p>{loadError}</p>

              <button
                type="button"
                className="customerwish-primary-btn"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !loadError && items.length === 0 && (
            <div className="customerwish-state">
              <div className="customerwish-state-icon">
                <i className="fa-regular fa-heart"></i>
              </div>

              <h2>Your Wishlist Is Empty</h2>

              <p>
                Save items you love and they'll show up here.
              </p>

              <Link to="/shop-all" className="customerwish-primary-btn">
                Shop Now
              </Link>
            </div>
          )}

          {/* Wishlist */}
          {!isLoading && !loadError && items.length > 0 && (
            <>
              <div className="customerwish-summary">
                <div className="customerwish-summary-card">
                  <div className="customerwish-summary-top">
                    <span className="customerwish-summary-label">SAVED</span>
                    <span className="customerwish-dot customerwish-dot--saved"></span>
                  </div>
                  <strong>{stats.saved}</strong>
                </div>

                <div className="customerwish-summary-card">
                  <div className="customerwish-summary-top">
                    <span className="customerwish-summary-label">IN STOCK</span>
                    <span className="customerwish-dot customerwish-dot--instock"></span>
                  </div>
                  <strong>{stats.inStock}</strong>
                </div>

                <div className="customerwish-summary-card">
                  <div className="customerwish-summary-top">
                    <span className="customerwish-summary-label">OUT OF STOCK</span>
                    <span className="customerwish-dot customerwish-dot--outstock"></span>
                  </div>
                  <strong>{stats.outOfStock}</strong>
                </div>

                <div className="customerwish-summary-card">
                  <div className="customerwish-summary-top">
                    <span className="customerwish-summary-label">TOTAL VALUE</span>
                    <span className="customerwish-dot customerwish-dot--value"></span>
                  </div>
                  <strong>{currency(stats.totalValue)}</strong>
                </div>
              </div>

              <div className="customerwish-toolbar">
                <div className="customerwish-tabs">
                  <button
                    type="button"
                    className={`customerwish-tab ${
                      activeTab === "all" ? "customerwish-tab--active" : ""
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    All {items.length}
                  </button>

                  {categoryTabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      className={`customerwish-tab ${
                        activeTab === tab.key ? "customerwish-tab--active" : ""
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label} {tab.count}
                    </button>
                  ))}
                </div>

                <div className="customerwish-search">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input
                    type="text"
                    placeholder="Search wishlist..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
              </div>

              <div className="customerwish-table-wrap">
                <table className="customerwish-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Availability</th>
                      <th>Added</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleItems.map((item) => (
                      <tr key={item._id}>
                        <td className="customerwish-cell-thumb">
                          <div className="customerwish-thumb">
                            <img
                              src={item.image}
                              alt={item.title || "Wishlist item"}
                            />
                          </div>
                        </td>

                        <td className="customerwish-cell-product">
                          {item.title || "Product"}
                        </td>

                        <td className="customerwish-cell-category">
                          {item.category || "—"}
                        </td>

                        <td className="customerwish-cell-price">
                          {currency(item.price)}
                        </td>

                        <td>
                          <span
                            className={`customerwish-status ${
                              isInStock(item)
                                ? "customerwish-status--in-stock"
                                : "customerwish-status--out-of-stock"
                            }`}
                          >
                            {isInStock(item) ? "In Stock" : "Out Of Stock"}
                          </span>
                        </td>

                        <td className="customerwish-cell-date">
                          {formatDate(item.addedAt)}
                        </td>
                      </tr>
                    ))}

                    {visibleItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="customerwish-table-empty">
                          No saved items match this filter.
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
    </div>
  );
}

export default Customerwish;