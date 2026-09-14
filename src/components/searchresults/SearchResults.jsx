import { useEffect, useMemo, useState } from "react";
import FilterAccordion from "./FilterAccordion";
import Sellercard from "../utils/sellercard/Sellercard";
import { getProducts } from "../../api/products";
import { normalizeProducts } from "../utils/normalizeProduct";
import { useWishlist } from "../../context/WishlistContext";
import "./SearchResults.css";

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

const SIZE_OPTIONS = [
  { label: "XS / US (0-4)", value: "XS" },
  { label: "S / US (4-6)", value: "S" },
  { label: "M / US (6-10)", value: "M" },
  { label: "L / US (10-14)", value: "L" },
  { label: "XL / US (12-16)", value: "XL" },
];

const COLOR_OPTIONS = [
  { label: "Black", value: "#1A1A1A" },
  { label: "Burgundy", value: "#8B3A3A" },
  { label: "Sage Green", value: "#6E8268" },
  { label: "Sky Blue", value: "#7EC6E0" },
  { label: "Navy", value: "#3B4A6B" },
  { label: "Beige", value: "#E8DCC8" },
  { label: "Pink", value: "#D9A3C7" },
];

const COLLECTION_OPTIONS = [
  { label: "In Stock", value: "In Stock" },
  { label: "Out of Stock", value: "Out of Stock" },
];

const FABRIC_OPTIONS = [
  { label: "Cotton", value: "Cotton" },
  { label: "Linen", value: "Linen" },
  { label: "Wool", value: "Wool" },
  { label: "Silk", value: "Silk" },
  { label: "Cashmere", value: "Cashmere" },
];

const EMPTY = [];

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function CheckboxOption({ label, checked, onChange, swatch }) {
  return (
    <label className="filter-option">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {swatch && (
        <span className="filter-option__swatch" style={{ backgroundColor: swatch }} />
      )}
      <span>{label}</span>
    </label>
  );
}

// Converts a normalized backend product into the shape this page's
// filters expect (a plain "In Stock" / "Out of Stock" collection string).
function toSearchResultProduct(product) {
  return {
    ...product,
    collection: product.inStock ? "In Stock" : "Out of Stock",
  };
}

function SearchResults({ query = "" }) {
  const { isInWishlist, toggleItem } = useWishlist();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [openSections, setOpenSections] = useState({
    sortBy: false,
    size: true,
    color: false,
    collection: true,
    fabric: true,
  });

  const [sortBy, setSortBy] = useState("recommended");
  const [selectedSizes, setSelectedSizes] = useState(EMPTY);
  const [selectedColors, setSelectedColors] = useState(EMPTY);
  const [selectedCollections, setSelectedCollections] = useState(EMPTY);
  const [selectedFabrics, setSelectedFabrics] = useState(EMPTY);
  const [showAppliedFilters, setShowAppliedFilters] = useState(true);

  // Fetches matching products from the backend (GET /products?search=...)
  // whenever the query changes, with a short debounce so we don't fire a
  // request on every single keystroke.
  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(() => {
      setIsLoading(true);
      setLoadError("");

      getProducts({ search: query.trim() })
        .then((data) => {
          if (isCancelled) return;
          setProducts(normalizeProducts(data).map(toSearchResultProduct));
        })
        .catch(() => {
          if (!isCancelled) setLoadError("Couldn't load search results right now.");
        })
        .finally(() => {
          if (!isCancelled) setIsLoading(false);
        });
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const clearAllFilters = () => {
    setSelectedSizes(EMPTY);
    setSelectedColors(EMPTY);
    setSelectedCollections(EMPTY);
    setSelectedFabrics(EMPTY);
    setSortBy("recommended");
  };

  // A flat list of every active filter, used to render the removable chips.
  const activeChips = useMemo(() => {
    const chips = [];
    selectedSizes.forEach((value) => {
      const opt = SIZE_OPTIONS.find((o) => o.value === value);
      chips.push({ group: "size", value, label: opt?.label ?? value });
    });
    selectedColors.forEach((value) => {
      const opt = COLOR_OPTIONS.find((o) => o.value === value);
      chips.push({ group: "color", value, label: opt?.label ?? value });
    });
    selectedCollections.forEach((value) => {
      chips.push({ group: "collection", value, label: value });
    });
    selectedFabrics.forEach((value) => {
      chips.push({ group: "fabric", value, label: value });
    });
    return chips;
  }, [selectedSizes, selectedColors, selectedCollections, selectedFabrics]);

  const removeChip = (chip) => {
    if (chip.group === "size") setSelectedSizes((prev) => prev.filter((v) => v !== chip.value));
    if (chip.group === "color") setSelectedColors((prev) => prev.filter((v) => v !== chip.value));
    if (chip.group === "collection")
      setSelectedCollections((prev) => prev.filter((v) => v !== chip.value));
    if (chip.group === "fabric") setSelectedFabrics((prev) => prev.filter((v) => v !== chip.value));
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let list = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.title} ${product.subtitle}`.toLowerCase().includes(normalizedQuery);

      const matchesSize =
        selectedSizes.length === 0 || product.sizes.some((s) => selectedSizes.includes(s));

      const matchesColor =
        selectedColors.length === 0 ||
        product.colors.some((c) => selectedColors.includes(c.toUpperCase()));

      const matchesCollection =
        selectedCollections.length === 0 || selectedCollections.includes(product.collection);

      const matchesFabric =
        selectedFabrics.length === 0 || selectedFabrics.includes(product.fabric);

      return matchesQuery && matchesSize && matchesColor && matchesCollection && matchesFabric;
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "newest") list = [...list].sort((a, b) => (a.id < b.id ? 1 : -1));

    return list;
  }, [
    products,
    query,
    selectedSizes,
    selectedColors,
    selectedCollections,
    selectedFabrics,
    sortBy,
  ]);

  return (
    <div className="search-results">
      <p className="search-results__count">
        {filteredProducts.length} {filteredProducts.length === 1 ? "Item" : "Items"}
      </p>

      <div className="search-results__body">
        <aside className="search-results__sidebar">
          <h2 className="search-results__filters-title">Filters</h2>

          {activeChips.length > 0 && (
            <>
              <div className="search-results__chips">
                {showAppliedFilters &&
                  activeChips.map((chip) => (
                    <button
                      key={`${chip.group}-${chip.value}`}
                      type="button"
                      className="search-results__chip"
                      onClick={() => removeChip(chip)}
                    >
                      {chip.label}
                      <span aria-hidden="true">✕</span>
                    </button>
                  ))}
              </div>

              <div className="search-results__chip-actions">
                <button
                  type="button"
                  className="search-results__clear-btn"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </button>
                <button
                  type="button"
                  className="search-results__applied-btn"
                  onClick={() => setShowAppliedFilters((prev) => !prev)}
                  aria-pressed={showAppliedFilters}
                >
                  Applied Filters
                </button>
              </div>
            </>
          )}

          <FilterAccordion
            title="Sort By"
            isOpen={openSections.sortBy}
            onToggle={() => toggleSection("sortBy")}
          >
            {SORT_OPTIONS.map((option) => (
              <label key={option.value} className="filter-option">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === option.value}
                  onChange={() => setSortBy(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </FilterAccordion>

          <FilterAccordion
            title="Size"
            isOpen={openSections.size}
            onToggle={() => toggleSection("size")}
          >
            {SIZE_OPTIONS.map((option) => (
              <CheckboxOption
                key={option.value}
                label={option.label}
                checked={selectedSizes.includes(option.value)}
                onChange={() => setSelectedSizes((prev) => toggleValue(prev, option.value))}
              />
            ))}
          </FilterAccordion>

          <FilterAccordion
            title="Color"
            isOpen={openSections.color}
            onToggle={() => toggleSection("color")}
          >
            {COLOR_OPTIONS.map((option) => (
              <CheckboxOption
                key={option.value}
                label={option.label}
                swatch={option.value}
                checked={selectedColors.includes(option.value)}
                onChange={() => setSelectedColors((prev) => toggleValue(prev, option.value))}
              />
            ))}
          </FilterAccordion>

          <FilterAccordion
            title="Collection"
            isOpen={openSections.collection}
            onToggle={() => toggleSection("collection")}
          >
            {COLLECTION_OPTIONS.map((option) => (
              <CheckboxOption
                key={option.value}
                label={option.label}
                checked={selectedCollections.includes(option.value)}
                onChange={() =>
                  setSelectedCollections((prev) => toggleValue(prev, option.value))
                }
              />
            ))}
          </FilterAccordion>

          <FilterAccordion
            title="Fabric"
            isOpen={openSections.fabric}
            onToggle={() => toggleSection("fabric")}
          >
            {FABRIC_OPTIONS.map((option) => (
              <CheckboxOption
                key={option.value}
                label={option.label}
                checked={selectedFabrics.includes(option.value)}
                onChange={() => setSelectedFabrics((prev) => toggleValue(prev, option.value))}
              />
            ))}
          </FilterAccordion>
        </aside>

        <div className="search-results__grid">
          {isLoading && (
            <p className="search-results__empty">Loading results…</p>
          )}

          {!isLoading && loadError && (
            <p className="search-results__empty">{loadError}</p>
          )}

          {!isLoading && !loadError && filteredProducts.length === 0 ? (
            <p className="search-results__empty">
              No results found{query.trim() ? ` for "${query.trim()}"` : ""}. Try adjusting your
              filters or search term.
            </p>
          ) : (
            !isLoading &&
            !loadError &&
            filteredProducts.map((product) => (
              <Sellercard
                key={product.id}
                id={product.id}
                title={product.title}
                subtitle={product.subtitle}
                price={product.price}
                image={product.image}
                isLiked={isInWishlist(product.id)}
                onToggleLike={() => toggleItem(product)}
                colors={product.colors}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;