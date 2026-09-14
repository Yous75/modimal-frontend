
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Shopall.css";

import { getProducts } from "../../api/products";
import { normalizeProduct } from "../utils/normalizeProduct";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

import heroLeftImg from "../../assets/shopall-hero-left.jpg";

// Converts a backend product into the shape used by this page.
function toShopallProduct(product) {
  const normalized = normalizeProduct(product);

  return {
    id: normalized.id,
    image: normalized.image,
    title: normalized.title,
    subtitle: normalized.subtitle,
    price: normalized.price,
    isNew: normalized.isNew,
    isBestSeller: normalized.isBestSeller,
    inStock: normalized.inStock,
    fabric: normalized.fabric,
    sizes: normalized.sizes,
    colors: normalized.colorNames,
  };
}

// Available colors for the filter.
const COLOR_OPTIONS = [
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#c1483f" },
  { name: "Green", hex: "#5b6b45" },
  { name: "Yellow", hex: "#e3c14b" },
  { name: "Dark Blue", hex: "#233752" },
  { name: "Purple", hex: "#7a5a9e" },
  { name: "Pink", hex: "#e2a2b5" },
  { name: "Light Blue", hex: "#8fb4cf" },
  { name: "Orange", hex: "#c97a3d" },
  { name: "White", hex: "#ffffff" },
];

// Available sizes.
const SIZE_OPTIONS = [
  "XS / US (0-2)",
  "S / US (4-6)",
  "M / US (8-10)",
  "L / US (10-14)",
  "XL / US (12-14)",
];

// Available fabrics.
const FABRIC_OPTIONS = ["Cotton", "Linen", "Wool", "Silk", "Cashmere"];

// Available stock options.
const COLLECTION_OPTIONS = ["In Stock", "Out Of Stock"];

// Sorting options.
const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "bestSeller", label: "Best Seller" },
  { id: "priceLowHigh", label: "Price: Low To High" },
  { id: "priceHighLow", label: "Price: High To Low" },
];

// Number of products displayed initially.
const PAGE_SIZE = 6;

// Finds the HEX color corresponding to a color name.
const colorHex = (name) =>
  COLOR_OPTIONS.find((c) => c.name === name)?.hex || "#ccc";

function Shopall() {
  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem } = useCart();

  // Products fetched from the backend.
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);
    setLoadError("");

    getProducts()
      .then((data) => {
        if (!isCancelled) {
          setProducts(data.map(toShopallProduct));
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setLoadError("Couldn't load products right now.");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Controls which filter sections are open or closed.
  const [openSections, setOpenSections] = useState({
    sortBy: false,
    size: false,
    color: false,
    collection: false,
    fabric: false,
  });

  // Controls whether applied filter pills are visible.
  const [appliedFiltersOpen, setAppliedFiltersOpen] = useState(true);

  // Stores the selected sorting method.
  const [sortBy, setSortBy] = useState("featured");

  // Stores selected size filters.
  const [sizeFilters, setSizeFilters] = useState([]);

  // Stores selected color filters.
  const [colorFilters, setColorFilters] = useState([]);

  // Stores selected stock filters.
  const [collectionFilters, setCollectionFilters] = useState([]);

  // Stores selected fabric filters.
  const [fabricFilters, setFabricFilters] = useState([]);

  // Number of products currently displayed.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Stores the selected color for each product.
  const [selectedColorByProduct, setSelectedColorByProduct] = useState({});

  // Opens or closes a filter section.
  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Adds or removes a value from a filter list.
  const toggleInList = (list, setList, value) => {
    // Reset "Load More" when a filter changes.
    setVisibleCount(PAGE_SIZE);

    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  // Adds or removes a product from the wishlist.
  const toggleWishlist = (product) => {
    toggleItem(product);
  };

  // Selects a color for a specific product.
  const selectColor = (productId, colorName) => {
    setSelectedColorByProduct((prev) => ({
      ...prev,
      [productId]: colorName,
    }));
  };

  // Resets every filter.
  const clearAllFilters = () => {
    setSortBy("featured");
    setSizeFilters([]);
    setColorFilters([]);
    setCollectionFilters([]);
    setFabricFilters([]);
    setVisibleCount(PAGE_SIZE);
  };

  // Removes one specific applied filter.
  const removeFilter = (category, value) => {
    setVisibleCount(PAGE_SIZE);

    if (category === "sortBy") {
      setSortBy("featured");
    } else if (category === "size") {
      setSizeFilters((prev) => prev.filter((v) => v !== value));
    } else if (category === "color") {
      setColorFilters((prev) => prev.filter((v) => v !== value));
    } else if (category === "collection") {
      setCollectionFilters((prev) => prev.filter((v) => v !== value));
    } else if (category === "fabric") {
      setFabricFilters((prev) => prev.filter((v) => v !== value));
    }
  };

  // Creates the list of currently applied filters.
  const appliedFilters = useMemo(() => {
    const pills = [];

    if (sortBy !== "featured") {
      pills.push({
        category: "sortBy",
        value: sortBy,
        label: SORT_OPTIONS.find((o) => o.id === sortBy)?.label,
      });
    }

    sizeFilters.forEach((v) =>
      pills.push({ category: "size", value: v, label: v })
    );

    colorFilters.forEach((v) =>
      pills.push({ category: "color", value: v, label: v })
    );

    collectionFilters.forEach((v) =>
      pills.push({ category: "collection", value: v, label: v })
    );

    fabricFilters.forEach((v) =>
      pills.push({ category: "fabric", value: v, label: v })
    );

    return pills;
  }, [
    sortBy,
    sizeFilters,
    colorFilters,
    collectionFilters,
    fabricFilters,
  ]);

  // Filters and sorts the products.
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Keep products containing the selected size.
      if (
        sizeFilters.length &&
        !sizeFilters.some((s) => p.sizes.includes(s))
      ) {
        return false;
      }

      // Keep products containing the selected color.
      if (
        colorFilters.length &&
        !colorFilters.some((c) => p.colors.includes(c))
      ) {
        return false;
      }

      // Keep products made from the selected fabric.
      if (fabricFilters.length && !fabricFilters.includes(p.fabric)) {
        return false;
      }

      // Keep products matching the stock filter.
      if (collectionFilters.length) {
        const label = p.inStock ? "In Stock" : "Out Of Stock";

        if (!collectionFilters.includes(label)) {
          return false;
        }
      }

      return true;
    });

    // Sort according to the selected sorting option.
    if (sortBy === "bestSeller") {
      result = [...result].sort(
        (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller)
      );
    } else if (sortBy === "priceLowHigh") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHighLow") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    products,
    sizeFilters,
    colorFilters,
    fabricFilters,
    collectionFilters,
    sortBy,
  ]);

  // Only display the first visibleCount products.
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Checks if there are still hidden products.
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <main className="shopall">
      {/* Breadcrumb navigation */}
      <nav className="shopall-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>

        <span className="shopall-breadcrumb-sep">/</span>

        <span className="shopall-breadcrumb-current">Shop All</span>
      </nav>

      {/* Hero image */}
      <section className="shopall-hero" aria-label="Shop All">
        <img src={heroLeftImg} alt="New arrivals styled look" />
      </section>

      <div className="shopall-content">
        {/* Sidebar containing filters */}
        <aside className="shopall-sidebar" aria-label="Filters">
          <h2 className="shopall-sidebar-title">Filters</h2>

          {/* Applied filter pills */}
          {appliedFilters.length > 0 && (
            <div className="applied-filters-block">
              <div className="applied-filters-row">
                {appliedFiltersOpen &&
                  appliedFilters.map((f) => (
                    <button
                      key={`${f.category}-${f.value}`}
                      type="button"
                      className="filter-pill"
                      onClick={() => removeFilter(f.category, f.value)}
                    >
                      {f.label}

                      <i
                        className="fa-solid fa-xmark"
                        aria-hidden="true"
                      ></i>
                    </button>
                  ))}
              </div>

              <div className="applied-filters-actions">
                {/* Removes all filters */}
                <button
                  type="button"
                  className="clear-all-btn"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </button>

                {/* Shows or hides filter pills */}
                <button
                  type="button"
                  className="applied-filters-toggle"
                  onClick={() =>
                    setAppliedFiltersOpen((prev) => !prev)
                  }
                  aria-expanded={appliedFiltersOpen}
                >
                  Applied Filters
                </button>
              </div>
            </div>
          )}

          {/* Sort By section */}
          <div className="filter-section">
            <button
              type="button"
              className="filter-header"
              onClick={() => toggleSection("sortBy")}
              aria-expanded={openSections.sortBy}
            >
              Sort By

              <i
                className={`fa-solid ${
                  openSections.sortBy ? "fa-minus" : "fa-plus"
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {openSections.sortBy && (
              <div className="filter-body">
                {SORT_OPTIONS.map((opt) => (
                  <label key={opt.id} className="filter-option">
                    <input
                      type="radio"
                      name="sortBy"
                      checked={sortBy === opt.id}
                      onChange={() => {
                        setVisibleCount(PAGE_SIZE);
                        setSortBy(opt.id);
                      }}
                    />

                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Size filter */}
          <div className="filter-section">
            <button
              type="button"
              className="filter-header"
              onClick={() => toggleSection("size")}
              aria-expanded={openSections.size}
            >
              Size

              <i
                className={`fa-solid ${
                  openSections.size ? "fa-minus" : "fa-plus"
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {openSections.size && (
              <div className="filter-body">
                {SIZE_OPTIONS.map((size) => (
                  <label key={size} className="filter-option">
                    <input
                      type="checkbox"
                      checked={sizeFilters.includes(size)}
                      onChange={() =>
                        toggleInList(sizeFilters, setSizeFilters, size)
                      }
                    />

                    {size}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Color filter */}
          <div className="filter-section">
            <button
              type="button"
              className="filter-header"
              onClick={() => toggleSection("color")}
              aria-expanded={openSections.color}
            >
              Color

              <i
                className={`fa-solid ${
                  openSections.color ? "fa-minus" : "fa-plus"
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {openSections.color && (
              <div className="filter-body">
                {COLOR_OPTIONS.map((c) => (
                  <label
                    key={c.name}
                    className="filter-option filter-option-color"
                  >
                    <input
                      type="checkbox"
                      checked={colorFilters.includes(c.name)}
                      onChange={() =>
                        toggleInList(
                          colorFilters,
                          setColorFilters,
                          c.name
                        )
                      }
                    />

                    <span
                      className="color-dot"
                      style={{ backgroundColor: c.hex }}
                    ></span>

                    {c.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Collection / stock filter */}
          <div className="filter-section">
            <button
              type="button"
              className="filter-header"
              onClick={() => toggleSection("collection")}
              aria-expanded={openSections.collection}
            >
              Collection

              <i
                className={`fa-solid ${
                  openSections.collection ? "fa-minus" : "fa-plus"
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {openSections.collection && (
              <div className="filter-body">
                {COLLECTION_OPTIONS.map((opt) => (
                  <label key={opt} className="filter-option">
                    <input
                      type="checkbox"
                      checked={collectionFilters.includes(opt)}
                      onChange={() =>
                        toggleInList(
                          collectionFilters,
                          setCollectionFilters,
                          opt
                        )
                      }
                    />

                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Fabric filter */}
          <div className="filter-section">
            <button
              type="button"
              className="filter-header"
              onClick={() => toggleSection("fabric")}
              aria-expanded={openSections.fabric}
            >
              Fabric

              <i
                className={`fa-solid ${
                  openSections.fabric ? "fa-minus" : "fa-plus"
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {openSections.fabric && (
              <div className="filter-body">
                {FABRIC_OPTIONS.map((opt) => (
                  <label key={opt} className="filter-option">
                    <input
                      type="checkbox"
                      checked={fabricFilters.includes(opt)}
                      onChange={() =>
                        toggleInList(
                          fabricFilters,
                          setFabricFilters,
                          opt
                        )
                      }
                    />

                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Product section */}
        <section
          className="shopall-grid-section"
          aria-label="Products"
        >
          {/* Loading and error states */}
          {isLoading && (
            <p className="shopall-status">Loading products…</p>
          )}

          {!isLoading && loadError && (
            <p className="shopall-status">{loadError}</p>
          )}

          {/* Empty state or product grid */}
          {!isLoading && !loadError && visibleProducts.length === 0 ? (
            <div className="shopall-empty">
              <p>
                {products.length === 0
                  ? "No products in the catalog yet — add some from your admin routes."
                  : "No products match your filters yet."}
              </p>

              {products.length > 0 && (
                <button
                  type="button"
                  className="clear-all-btn"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            !isLoading &&
            !loadError && (
              <div className="product-grid">
                {visibleProducts.map((product) => {
                  // Get selected color or use the first color by default.
                  const activeColor =
                    selectedColorByProduct[product.id] ||
                    product.colors?.[0];

                  // Check whether this product is liked.
                  const isLiked = isInWishlist(product.id);

                  return (
                    <article
                      key={product.id}
                      className="product-card"
                    >
                      <Link
                        to={`/product/${product.id}`}
                        className="product-card__link"
                      >
                        <div className="product-media">
                          {/* Product image */}
                          <img
                            src={product.image}
                            alt={product.title}
                          />

                          {/* Show "New" badge if product is new */}
                          {product.isNew && (
                            <span className="product-badge">
                              New
                            </span>
                          )}

                          {/* Wishlist button */}
                          <button
                            type="button"
                            className={`product-wishlist ${
                              isLiked ? "active" : ""
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(product);
                            }}
                            aria-label={
                              isLiked
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                            aria-pressed={isLiked}
                          >
                            <i
                              className={
                                isLiked
                                  ? "fa-solid fa-heart"
                                  : "fa-regular fa-heart"
                              }
                            ></i>
                          </button>

                          {/* Quick Add button */}
                          <button
                            type="button"
                            className="product-quick-add"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              addItem(product, {
                                size: product.sizes?.[0],
                                color: activeColor,
                                qty: 1,
                              });
                            }}
                          >
                            + Quick Add
                          </button>
                        </div>

                        {/* Product information */}
                        <div className="product-info">
                          <div className="product-title-row">
                            <h3 className="product-title">
                              {product.title}
                            </h3>

                            <span className="product-price">
                              ${product.price}
                            </span>
                          </div>

                          <p className="product-subtitle">
                            {product.subtitle}
                          </p>
                        </div>
                      </Link>

                      {/* Product color choices */}
                      <div
                        className="product-swatches"
                        role="group"
                        aria-label={`${product.title} colors`}
                      >
                        {product.colors?.map((colorName) => (
                          <button
                            key={colorName}
                            type="button"
                            className={`swatch-dot ${
                              activeColor === colorName ? "selected" : ""
                            }`}
                            style={{
                              backgroundColor: colorHex(colorName),
                            }}
                            aria-label={colorName}
                            aria-pressed={activeColor === colorName}
                            onClick={() =>
                              selectColor(product.id, colorName)
                            }
                          ></button>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            )
          )}

          {/* Load More button */}
          {hasMore && !isLoading && !loadError && (
            <div className="shopall-load-more-wrap">
              <button
                type="button"
                className="shopall-load-more"
                onClick={() =>
                  setVisibleCount((prev) => prev + PAGE_SIZE)
                }
              >
                Load More
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Shopall;
