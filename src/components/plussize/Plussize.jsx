
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Plussize.css";

import { getProducts } from "../../api/products";
import { normalizeProduct } from "../utils/normalizeProduct";
import { useWishlist } from "../../context/WishlistContext";

import heroLeft from "../../assets/plussize-hero-left.jpg";

// Converts a normalized backend product into the shape
// expected by the Plus Size product cards.
function toPlussizeProduct(product) {
  const normalized = normalizeProduct(product);

  return {
    id: normalized.id,
    img: normalized.image,
    badge: normalized.isNew ? "New" : null,
    title: normalized.title,
    subtitle: normalized.subtitle,
    price: `$${normalized.price}`,
    colors: normalized.colors,
  };
}

// Sorting options.
const SORT_OPTIONS = [
  "Featured",
  "Best Seller",
  "Price: Low to High",
  "Price: High to Sort",
];

// Available sizes.
const SIZE_OPTIONS = [
  "1X / US (18)",
  "2X / US (20)",
  "3X / US (22)",
];

// Available colors.
const COLOR_OPTIONS = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "Red", hex: "#B23A3A" },
  { name: "Green", hex: "#5C7A5C" },
  { name: "Yellow", hex: "#D9B23C" },
  { name: "Dark Blue", hex: "#2C3E5C" },
  { name: "Purple", hex: "#6B4C8A" },
  { name: "Pink", hex: "#D98CA0" },
  { name: "Light Blue", hex: "#9DBFD9" },
  { name: "Orange", hex: "#C97B3D" },
  { name: "White", hex: "#F5F3EE" },
];

// Available stock options.
const COLLECTION_OPTIONS = ["In Stock", "Out of Stock"];

// Available fabrics.
const FABRIC_OPTIONS = [
  "Cotton",
  "Linen",
  "Wool",
  "Silk",
  "Cashmere",
];

// Default filters.
const DEFAULT_FILTERS = {
  sortBy: "Best Seller",
  size: ["2X / US (20)"],
  color: ["Black"],
  collection: ["In Stock"],
  fabric: [],
};

const PAGE_SIZE = 6;
const LOAD_MORE_STEP = 4;

function Plussize() {
  const { isInWishlist, toggleItem } = useWishlist();

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
          setProducts(
            data
              .filter((product) => product.isPlusSize)
              .map(toPlussizeProduct)
          );
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

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [openSections, setOpenSections] = useState({
    sortBy: false,
    size: false,
    color: false,
    collection: false,
    fabric: false,
  });

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Opens or closes a filter section.
  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Changes the selected sorting method.
  const setSort = (value) => {
    setVisibleCount(PAGE_SIZE);

    setFilters((prev) => ({
      ...prev,
      sortBy: value,
    }));
  };

  // Adds or removes a filter value.
  const toggleMulti = (category, value) => {
    setVisibleCount(PAGE_SIZE);

    setFilters((prev) => {
      const current = prev[category];

      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return {
        ...prev,
        [category]: next,
      };
    });
  };

  // Clears all filters.
  const clearAllFilters = () => {
    setFilters({
      sortBy: "Featured",
      size: [],
      color: [],
      collection: [],
      fabric: [],
    });

    setVisibleCount(PAGE_SIZE);
  };

  // Adds or removes a product from the wishlist.
  const toggleLike = (product) => {
    toggleItem(product);
  };

  // Loads more products.
  const loadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + LOAD_MORE_STEP, products.length)
    );
  };

  // Creates the list of currently applied filter tags.
  const tags = useMemo(() => {
    const list = [];

    if (filters.sortBy !== "Featured") {
      list.push({
        category: "sortBy",
        label: filters.sortBy,
      });
    }

    filters.size.forEach((v) =>
      list.push({ category: "size", label: v })
    );

    filters.color.forEach((v) =>
      list.push({ category: "color", label: v })
    );

    filters.collection.forEach((v) =>
      list.push({ category: "collection", label: v })
    );

    filters.fabric.forEach((v) =>
      list.push({ category: "fabric", label: v })
    );

    return list;
  }, [filters]);

  // Removes one applied filter.
  const removeTag = (tag) => {
    if (tag.category === "sortBy") {
      setSort("Featured");
    } else {
      toggleMulti(tag.category, tag.label);
    }
  };

  const visibleProducts = products.slice(0, visibleCount);

  const hasMore = visibleCount < products.length;

  return (
    <main className="plussize-page">
      <h1 className="visually-hidden">Plus Size Collection</h1>

      {/* Breadcrumb navigation */}
      <nav className="plussize-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>

        <span className="crumb-sep">/</span>

        <span className="crumb-current">Plus Size</span>
      </nav>

      {/* Hero image */}
      <div className="plussize-hero">
        <img
          src={heroLeft}
          alt="Model wearing a plus size sage green wrap set"
        />
      </div>

      <div className="plussize-body">
        {/* Sidebar */}
        <aside
          className="plussize-sidebar"
          aria-label="Product filters"
        >
          <div className="filters-heading">
            <h2>Filters</h2>

            {tags.length > 0 && (
              <span className="applied-filters-badge">
                {tags.length}
              </span>
            )}
          </div>

          {/* Applied filter tags */}
          {tags.length > 0 && (
            <div className="filter-tags">
              {tags.map((tag) => (
                <button
                  key={`${tag.category}-${tag.label}`}
                  type="button"
                  className="filter-tag"
                  onClick={() => removeTag(tag)}
                >
                  {tag.label}

                  <i
                    className="fa-solid fa-xmark"
                    aria-hidden="true"
                  ></i>
                </button>
              ))}

              <button
                type="button"
                className="clear-all"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}

          <div className="filter-accordion">
            {/* Sort By */}
            <div className="filter-accordion-item">
              <button
                type="button"
                className="filter-accordion-header"
                aria-expanded={openSections.sortBy}
                onClick={() => toggleSection("sortBy")}
              >
                Sort By

                <i
                  className={`fa-solid ${
                    openSections.sortBy
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                  aria-hidden="true"
                ></i>
              </button>

              {openSections.sortBy && (
                <div className="filter-accordion-panel">
                  {SORT_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="filter-option"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        checked={filters.sortBy === option}
                        onChange={() => setSort(option)}
                      />

                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Size */}
            <div className="filter-accordion-item">
              <button
                type="button"
                className="filter-accordion-header"
                aria-expanded={openSections.size}
                onClick={() => toggleSection("size")}
              >
                Size

                <i
                  className={`fa-solid ${
                    openSections.size
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                  aria-hidden="true"
                ></i>
              </button>

              {openSections.size && (
                <div className="filter-accordion-panel">
                  {SIZE_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="filter-option"
                    >
                      <input
                        type="checkbox"
                        checked={filters.size.includes(option)}
                        onChange={() =>
                          toggleMulti("size", option)
                        }
                      />

                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Color */}
            <div className="filter-accordion-item">
              <button
                type="button"
                className="filter-accordion-header"
                aria-expanded={openSections.color}
                onClick={() => toggleSection("color")}
              >
                Color

                <i
                  className={`fa-solid ${
                    openSections.color
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                  aria-hidden="true"
                ></i>
              </button>

              {openSections.color && (
                <div className="filter-accordion-panel">
                  {COLOR_OPTIONS.map((option) => (
                    <label
                      key={option.name}
                      className="filter-option filter-option-color"
                    >
                      <input
                        type="checkbox"
                        checked={filters.color.includes(option.name)}
                        onChange={() =>
                          toggleMulti("color", option.name)
                        }
                      />

                      <span
                        className="option-swatch"
                        style={{
                          backgroundColor: option.hex,
                        }}
                        aria-hidden="true"
                      ></span>

                      {option.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Collection */}
            <div className="filter-accordion-item">
              <button
                type="button"
                className="filter-accordion-header"
                aria-expanded={openSections.collection}
                onClick={() => toggleSection("collection")}
              >
                Collection

                <i
                  className={`fa-solid ${
                    openSections.collection
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                  aria-hidden="true"
                ></i>
              </button>

              {openSections.collection && (
                <div className="filter-accordion-panel">
                  {COLLECTION_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="filter-option"
                    >
                      <input
                        type="checkbox"
                        checked={filters.collection.includes(option)}
                        onChange={() =>
                          toggleMulti("collection", option)
                        }
                      />

                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Fabric */}
            <div className="filter-accordion-item">
              <button
                type="button"
                className="filter-accordion-header"
                aria-expanded={openSections.fabric}
                onClick={() => toggleSection("fabric")}
              >
                Fabric

                <i
                  className={`fa-solid ${
                    openSections.fabric
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                  aria-hidden="true"
                ></i>
              </button>

              {openSections.fabric && (
                <div className="filter-accordion-panel">
                  {FABRIC_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="filter-option"
                    >
                      <input
                        type="checkbox"
                        checked={filters.fabric.includes(option)}
                        onChange={() =>
                          toggleMulti("fabric", option)
                        }
                      />

                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <section
          className="plussize-main"
          aria-label="Plus size products"
        >
          {/* Loading state */}
          {isLoading && (
            <p className="plussize-status">
              Loading products…
            </p>
          )}

          {/* Error state */}
          {!isLoading && loadError && (
            <p className="plussize-status">{loadError}</p>
          )}

          {/* Empty state */}
          {!isLoading && !loadError && products.length === 0 && (
            <p className="plussize-status">
              No plus size products yet — mark a product "Plus Size"
              from your admin routes.
            </p>
          )}

          {/* Product grid */}
          {!isLoading && !loadError && products.length > 0 && (
            <div className="product-grid">
              {visibleProducts.map((product) => {
                const liked = isInWishlist(product.id);

                return (
                  <article
                    key={product.id}
                    className="product-card"
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="product-card__link"
                    >
                      {/* Product image */}
                      <div className="product-image-wrap">
                        <img
                          src={product.img}
                          alt={`${product.title} — ${product.subtitle}`}
                        />

                        {product.badge && (
                          <span
                            className={`product-badge badge-${product.badge.toLowerCase()}`}
                          >
                            {product.badge}
                          </span>
                        )}

                        {/* Wishlist button */}
                        <button
                          type="button"
                          className={`wishlist-btn ${
                            liked ? "liked" : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleLike(product);
                          }}
                          aria-label={
                            liked
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          aria-pressed={liked}
                        >
                          <i
                            className={`${
                              liked ? "fa-solid" : "fa-regular"
                            } fa-heart`}
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>

                      {/* Product information */}
                      <div className="product-info">
                        <p className="product-subtitle">
                          {product.subtitle}
                        </p>

                        <h3 className="product-title">
                          {product.title}
                        </h3>

                        <p className="product-price">
                          {product.price}
                        </p>
                      </div>
                    </Link>

                    {/* Product colors */}
                    <div className="product-colors">
                      {product.colors?.map((color, idx) => (
                        <button
                          key={`${product.id}-${idx}`}
                          type="button"
                          className="color-swatch"
                          style={{ backgroundColor: color }}
                          aria-label={`View color option ${idx + 1}`}
                        ></button>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Load More button */}
          {hasMore && !isLoading && !loadError && (
            <div className="load-more-wrap">
              <button
                type="button"
                className="load-more-btn"
                onClick={loadMore}
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

export default Plussize;