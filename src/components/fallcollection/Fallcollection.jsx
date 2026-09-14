
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Sellercard from "../utils/sellercard/Sellercard";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { getProducts } from "../../api/products";
import { normalizeProduct } from "../utils/normalizeProduct";

import "./Fallcollection.css";

// Asset imports: hero banners only.
// The backend Product model does not currently have a season/collection field.
import fallHeroLeft from "../../assets/fall-hero-left.jpg";
import fallHeroRight from "../../assets/fall-hero-right.jpg";

// Available colors for the filter
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

// Available sizes
const SIZE_OPTIONS = [
  "XS / US (0-2)",
  "S / US (4-6)",
  "M / US (8-10)",
  "L / US (10-14)",
  "XL / US (12-14)",
];

// Available fabrics
const FABRIC_OPTIONS = [
  "Cotton",
  "Linen",
  "Wool",
  "Silk",
  "Cashmere",
];

// Available stock options
const COLLECTION_OPTIONS = [
  "In Stock",
  "Out Of Stock",
];

// Sorting options
const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "bestSeller", label: "Best Seller" },
  { id: "priceLowHigh", label: "Price: Low To High" },
  { id: "priceHighLow", label: "Price: High To Low" },
];

// Number of products displayed initially
const PAGE_SIZE = 6;

// Converts a backend product into the exact structure needed
// by the Fall Collection filters and Sellercard.
function toFallProduct(product) {
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
    sizes: normalized.sizes || [],
    colors: normalized.colorNames || [],
    colorNames: normalized.colorNames || [],
  };
}

// Finds the HEX color corresponding to a color name
const colorHex = (name) =>
  COLOR_OPTIONS.find((color) => color.name === name)?.hex || "#ccc";

const Fallcollection = () => {
  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem } = useCart();

  // Products fetched from the backend
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Controls which filter sections are open or closed
  const [openSections, setOpenSections] = useState({
    sortBy: false,
    size: false,
    color: false,
    collection: false,
    fabric: false,
  });

  // Controls whether applied filter pills are visible
  const [appliedFiltersOpen, setAppliedFiltersOpen] = useState(true);

  // Stores the selected sorting method
  const [sortBy, setSortBy] = useState("featured");

  // Stores selected size filters
  const [sizeFilters, setSizeFilters] = useState([]);

  // Stores selected color filters
  const [colorFilters, setColorFilters] = useState([]);

  // Stores selected stock filters
  const [collectionFilters, setCollectionFilters] = useState([]);

  // Stores selected fabric filters
  const [fabricFilters, setFabricFilters] = useState([]);

  // Number of products currently displayed
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Fetch products from the backend
  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);
    setLoadError("");

    getProducts()
      .then((data) => {
        if (isCancelled) return;

        // Normalize all backend products.
        // Unlike the previous version, do not slice the products here.
        // This allows filtering and Load More to work correctly.
        const productList = Array.isArray(data)
          ? data
          : data?.products || [];

        setProducts(productList.map(toFallProduct));
      })
      .catch(() => {
        if (!isCancelled) {
          setLoadError(
            "Couldn't load the collection right now."
          );
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

  // Opens or closes a filter section
  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Adds or removes a value from a filter list
  const toggleInList = (list, setList, value) => {
    // Reset Load More when a filter changes
    setVisibleCount(PAGE_SIZE);

    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  // Resets every filter
  const clearAllFilters = () => {
    setSortBy("featured");
    setSizeFilters([]);
    setColorFilters([]);
    setCollectionFilters([]);
    setFabricFilters([]);
    setVisibleCount(PAGE_SIZE);
  };

  // Removes one specific applied filter
  const removeFilter = (category, value) => {
    // Reset displayed products
    setVisibleCount(PAGE_SIZE);

    if (category === "sortBy") {
      setSortBy("featured");
    } else if (category === "size") {
      setSizeFilters((prev) =>
        prev.filter((item) => item !== value)
      );
    } else if (category === "color") {
      setColorFilters((prev) =>
        prev.filter((item) => item !== value)
      );
    } else if (category === "collection") {
      setCollectionFilters((prev) =>
        prev.filter((item) => item !== value)
      );
    } else if (category === "fabric") {
      setFabricFilters((prev) =>
        prev.filter((item) => item !== value)
      );
    }
  };

  // Creates the list of currently applied filters
  const appliedFilters = useMemo(() => {
    const pills = [];

    // Add sorting filter if it isn't Featured
    if (sortBy !== "featured") {
      pills.push({
        category: "sortBy",
        value: sortBy,
        label:
          SORT_OPTIONS.find((option) => option.id === sortBy)
            ?.label || sortBy,
      });
    }

    sizeFilters.forEach((value) => {
      pills.push({
        category: "size",
        value,
        label: value,
      });
    });

    colorFilters.forEach((value) => {
      pills.push({
        category: "color",
        value,
        label: value,
      });
    });

    collectionFilters.forEach((value) => {
      pills.push({
        category: "collection",
        value,
        label: value,
      });
    });

    fabricFilters.forEach((value) => {
      pills.push({
        category: "fabric",
        value,
        label: value,
      });
    });

    return pills;
  }, [
    sortBy,
    sizeFilters,
    colorFilters,
    collectionFilters,
    fabricFilters,
  ]);

  // Filters and sorts the products
  const filteredProducts = useMemo(() => {
    // Start with all products and apply the selected filters
    let result = products.filter((product) => {
      // Keep products containing at least one selected size
      if (
        sizeFilters.length > 0 &&
        !sizeFilters.some((size) =>
          product.sizes.includes(size)
        )
      ) {
        return false;
      }

      // Keep products containing at least one selected color
      if (
        colorFilters.length > 0 &&
        !colorFilters.some((color) =>
          product.colors.includes(color)
        )
      ) {
        return false;
      }

      // Keep products made from one of the selected fabrics
      if (
        fabricFilters.length > 0 &&
        !fabricFilters.includes(product.fabric)
      ) {
        return false;
      }

      // Keep products matching the selected stock filter
      if (collectionFilters.length > 0) {
        const stockLabel = product.inStock
          ? "In Stock"
          : "Out Of Stock";

        if (!collectionFilters.includes(stockLabel)) {
          return false;
        }
      }

      return true;
    });

    // Apply the selected sorting method
    if (sortBy === "bestSeller") {
      // Best sellers come first
      result = [...result].sort(
        (a, b) =>
          Number(b.isBestSeller) - Number(a.isBestSeller)
      );
    } else if (sortBy === "priceLowHigh") {
      // Lowest prices first
      result = [...result].sort(
        (a, b) => a.price - b.price
      );
    } else if (sortBy === "priceHighLow") {
      // Highest prices first
      result = [...result].sort(
        (a, b) => b.price - a.price
      );
    }

    return result;
  }, [
    products,
    sizeFilters,
    colorFilters,
    collectionFilters,
    fabricFilters,
    sortBy,
  ]);

  // Only display the first visibleCount products
  const visibleProducts = filteredProducts.slice(
    0,
    visibleCount
  );

  // Checks whether there are still hidden products
  const hasMore =
    visibleCount < filteredProducts.length;

  // Wishlist handler
  const handleToggleLike = (id) => {
    const product = products.find(
      (item) => item.id === id
    );

    if (product) {
      toggleItem(product);
    }
  };

  // Cart handler
  const handleAddToCart = (id) => {
    const product = products.find(
      (item) => item.id === id
    );

    if (product) {
      addItem(product, {
        size: product.sizes?.[0],
        color: product.colors?.[0],
        qty: 1,
      });
    }
  };

  return (
    <main className="fall-collection">
      {/* Breadcrumbs */}
      <nav
        className="fall-collection__breadcrumb"
        aria-label="Breadcrumb"
      >
        <Link to="/">Home</Link>

        <span className="fall-collection__breadcrumb-divider">
          /
        </span>

        <span className="fall-collection__breadcrumb-current">
          Fall Collection
        </span>
      </nav>

      {/* Hero Banner Grid */}
      <section
        className="fall-collection__hero"
        aria-label="Fall Collection"
      >
        <div className="fall-collection__hero-card">
          <img
            className="fall-collection__hero-img"
            src={fallHeroLeft}
            alt="Fall Collection Hero 1"
          />

          <div className="fall-collection__hero-overlay">
            <span className="fall-collection__hero-subtitle">
              MODIMAL — AW 2026
            </span>

            <h1 className="fall-collection__hero-title">
              Fall Collection
            </h1>
          </div>
        </div>

        <div className="fall-collection__hero-card">
          <img
            className="fall-collection__hero-img"
            src={fallHeroRight}
            alt="Fall Collection Hero 2"
          />
        </div>
      </section>

      {/* Content Layout */}
      <div className="fall-collection__content">
        {/* Sidebar */}
        <aside
          className="fall-collection__sidebar"
          aria-label="Filters"
        >
          <h2 className="fall-collection__sidebar-title">
            Filters
          </h2>

          {/* Applied filter pills */}
          {appliedFilters.length > 0 && (
            <div className="applied-filters-block">
              <div className="applied-filters-row">
                {appliedFiltersOpen &&
                  appliedFilters.map((filter) => (
                    <button
                      key={`${filter.category}-${filter.value}`}
                      type="button"
                      className="filter-pill"
                      onClick={() =>
                        removeFilter(
                          filter.category,
                          filter.value
                        )
                      }
                    >
                      {filter.label}

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
                    setAppliedFiltersOpen(
                      (prev) => !prev
                    )
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
                  openSections.sortBy
                    ? "fa-minus"
                    : "fa-plus"
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {openSections.sortBy && (
              <div className="filter-body">
                {SORT_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className="filter-option"
                  >
                    <input
                      type="radio"
                      name="fall-sortBy"
                      checked={sortBy === option.id}
                      onChange={() => {
                        setVisibleCount(PAGE_SIZE);
                        setSortBy(option.id);
                      }}
                    />

                    {option.label}
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
                  openSections.size
                    ? "fa-minus"
                    : "fa-plus"
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {openSections.size && (
              <div className="filter-body">
                {SIZE_OPTIONS.map((size) => (
                  <label
                    key={size}
                    className="filter-option"
                  >
                    <input
                      type="checkbox"
                      checked={sizeFilters.includes(size)}
                      onChange={() =>
                        toggleInList(
                          sizeFilters,
                          setSizeFilters,
                          size
                        )
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
                  openSections.color
                    ? "fa-minus"
                    : "fa-plus"
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {openSections.color && (
              <div className="filter-body">
                {COLOR_OPTIONS.map((color) => (
                  <label
                    key={color.name}
                    className="filter-option filter-option-color"
                  >
                    <input
                      type="checkbox"
                      checked={colorFilters.includes(
                        color.name
                      )}
                      onChange={() =>
                        toggleInList(
                          colorFilters,
                          setColorFilters,
                          color.name
                        )
                      }
                    />

                    {/* Small colored circle */}
                    <span
                      className="color-dot"
                      style={{
                        backgroundColor: color.hex,
                      }}
                    ></span>

                    {color.name}
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
                  openSections.collection
                    ? "fa-minus"
                    : "fa-plus"
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {openSections.collection && (
              <div className="filter-body">
                {COLLECTION_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="filter-option"
                  >
                    <input
                      type="checkbox"
                      checked={collectionFilters.includes(
                        option
                      )}
                      onChange={() =>
                        toggleInList(
                          collectionFilters,
                          setCollectionFilters,
                          option
                        )
                      }
                    />

                    {option}
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
                  openSections.fabric
                    ? "fa-minus"
                    : "fa-plus"
                }`}
                aria-hidden="true"
              ></i>
            </button>

            {openSections.fabric && (
              <div className="filter-body">
                {FABRIC_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className="filter-option"
                  >
                    <input
                      type="checkbox"
                      checked={fabricFilters.includes(option)}
                      onChange={() =>
                        toggleInList(
                          fabricFilters,
                          setFabricFilters,
                          option
                        )
                      }
                    />

                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <section
          className="fall-collection__grid-section"
          aria-label="Fall Collection Products"
        >
          {/* Loading state */}
          {isLoading && (
            <p className="fall-collection__status">
              Loading the collection…
            </p>
          )}

          {/* Error state */}
          {!isLoading && loadError && (
            <p className="fall-collection__status">
              {loadError}
            </p>
          )}

          {/* Empty state */}
          {!isLoading &&
            !loadError &&
            visibleProducts.length === 0 && (
              <div className="fall-collection__empty">
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
            )}

          {/* Product grid */}
          {!isLoading &&
            !loadError &&
            visibleProducts.length > 0 && (
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <Sellercard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    subtitle={product.subtitle}
                    price={product.price}
                    image={product.image}
                    colors={product.colors}
                    isNew={product.isNew}
                    isLiked={isInWishlist(product.id)}
                    onToggleLike={() =>
                      handleToggleLike(product.id)
                    }
                    onAddToCart={() =>
                      handleAddToCart(product.id)
                    }
                  />
                ))}
              </div>
            )}

          {/* Load More button */}
          {!isLoading && !loadError && hasMore && (
            <div className="fall-collection__load-more-wrap">
              <button
                type="button"
                className="fall-collection__load-more"
                onClick={() =>
                  setVisibleCount(
                    (prev) => prev + PAGE_SIZE
                  )
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
};

export default Fallcollection;