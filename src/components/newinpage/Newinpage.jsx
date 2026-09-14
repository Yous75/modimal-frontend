import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sellercard from "../utils/sellercard/Sellercard";
import { getProducts } from "../../api/products";
import { normalizeProducts } from "../utils/normalizeProduct";
import { useWishlist } from "../../context/WishlistContext";
import "./Newinpage.css";

import newInHero1 from "../../assets/fake-newin-hero1.jpg";
import newInHero2 from "../../assets/fake-newin-hero2.jpg";

const FILTER_OPTIONS = {
  sortBy: [
    "Featured",
    "Newest",
    "Price: Low To High",
    "Price: High To Low",
  ],

  size: [
    "XS / US (0-2)",
    "S / US (4-6)",
    "M / US (8-10)",
    "L / US (10-14)",
    "XL / US (12-14)",
  ],

  color: [
    "Black",
    "Red",
    "Green",
    "Yellow",
    "Dark Blue",
    "Purple",
    "Pink",
    "Light Blue",
    "White",
  ],

  collection: [
    "In Stock",
    "Out Of Stock",
  ],

  fabric: [
    "Cotton",
    "Linen",
    "Wool",
    "Silk",
    "Cashmere",
  ],
};

const FILTER_LABELS = {
  sortBy: "Sort By",
  size: "Size",
  color: "Color",
  collection: "Collection",
  fabric: "Fabric",
};

function Newinpage() {
  const { isInWishlist, toggleItem } = useWishlist();

  // Products fetched from the backend and narrowed down to the ones
  // tagged "New In".
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Keeps track of opened filter accordions.
  const [openSections, setOpenSections] = useState({});

  // Keeps track of selected filter values.
  const [selectedFilters, setSelectedFilters] =
    useState({
      sortBy: [],
      size: [],
      color: [],
      collection: [],
      fabric: [],
    });

  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);
    setLoadError("");

    getProducts()
      .then((data) => {
        if (isCancelled) return;
        const newArrivals = normalizeProducts(data).filter(
          (product) => product.isNew
        );
        setAllProducts(newArrivals);
      })
      .catch(() => {
        if (!isCancelled) setLoadError("Couldn't load new arrivals right now.");
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleFilter = (category, value) => {
    setSelectedFilters((prev) => {
      const values = prev[category];

      return {
        ...prev,
        [category]: values.includes(value)
          ? values.filter(
              (item) => item !== value
            )
          : [...values, value],
      };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      sortBy: [],
      size: [],
      color: [],
      collection: [],
      fabric: [],
    });
  };

  // Applies the selected sidebar filters and sorting.
  const visibleProducts = allProducts.filter(
    (product) => {
      if (
        selectedFilters.size.length &&
        !selectedFilters.size.some((size) =>
          product.sizes.includes(size)
        )
      ) {
        return false;
      }

      if (
        selectedFilters.color.length &&
        !selectedFilters.color.some((color) =>
          product.colorNames.includes(color)
        )
      ) {
        return false;
      }

      if (
        selectedFilters.collection.length &&
        !selectedFilters.collection.includes(
          product.inStock
            ? "In Stock"
            : "Out Of Stock"
        )
      ) {
        return false;
      }

      if (
        selectedFilters.fabric.length &&
        !selectedFilters.fabric.includes(
          product.fabric
        )
      ) {
        return false;
      }

      return true;
    }
  ).sort((a, b) => {
    const sort =
      selectedFilters.sortBy[0];

    if (sort === "Price: Low To High") {
      return a.price - b.price;
    }

    if (sort === "Price: High To Low") {
      return b.price - a.price;
    }

    return 0;
  });

  return (
    <main className="new-in-page">

      {/* Breadcrumb navigation */}
      <nav
        className="new-in-page__breadcrumb"
        aria-label="Breadcrumb"
      >
        <Link to="/">Home</Link>
        <span>/</span>
        <span>New In</span>
      </nav>

      {/* Two-column editorial hero banner */}
      <section
        className="new-in-page__hero"
        aria-label="New In"
      >
        <div className="new-in-page__hero-item">
          <img
            src={newInHero1}
            alt="New collection editorial look 1"
          />
        </div>

        <div className="new-in-page__hero-item">
          <img
            src={newInHero2}
            alt="New collection editorial look 2"
          />
        </div>
      </section>

      {/* Sidebar filters and reusable product cards */}
      <section className="new-in-page__content">

        <aside
          className="new-in-page__sidebar"
          aria-label="Filters"
        >
          <div className="new-in-page__filter-heading">
            <h2>Filters</h2>

            {Object.values(
              selectedFilters
            ).some(
              (values) =>
                values.length > 0
            ) && (
              <button
                type="button"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>

          {Object.entries(
            FILTER_OPTIONS
          ).map(([key, options]) => (
            <div
              className="new-in-page__filter-section"
              key={key}
            >
              <button
                type="button"
                className="new-in-page__filter-button"
                onClick={() =>
                  toggleSection(key)
                }
                aria-expanded={
                  !!openSections[key]
                }
              >
                <span>
                  {FILTER_LABELS[key]}
                </span>

                <i
                  className={`fa-solid ${
                    openSections[key]
                      ? "fa-minus"
                      : "fa-plus"
                  }`}
                  aria-hidden="true"
                />
              </button>

              {openSections[key] && (
                <div className="new-in-page__filter-body">

                  {options.map(
                    (option) => (
                      <label
                        className="new-in-page__filter-option"
                        key={option}
                      >
                        <input
                          type={
                            key === "sortBy"
                              ? "radio"
                              : "checkbox"
                          }
                          name={key}
                          checked={selectedFilters[
                            key
                          ].includes(option)}
                          onChange={() =>
                            toggleFilter(
                              key,
                              option
                            )
                          }
                        />

                        <span>
                          {option}
                        </span>
                      </label>
                    )
                  )}

                </div>
              )}
            </div>
          ))}
        </aside>

        <section
          className="new-in-page__products"
          aria-label="New arrival products"
        >
          {isLoading && (
            <p className="new-in-page__status">
              Loading new arrivals…
            </p>
          )}

          {!isLoading && loadError && (
            <p className="new-in-page__status">
              {loadError}
            </p>
          )}

          {!isLoading && !loadError && visibleProducts.length ? (
            <div className="new-in-page__grid">

              {visibleProducts.map(
                (product) => (
                  <div
                    className="new-in-page__card-wrap"
                    key={product.id}
                  >
                    <span className="new-in-page__badge">
                      NEW
                    </span>

                    <Sellercard
                      id={product.id}
                      title={product.title}
                      subtitle={product.subtitle}
                      price={product.price}
                      image={product.image}
                      colors={product.colors}
                      isLiked={isInWishlist(product.id)}
                      onToggleLike={() => toggleItem(product)}
                    />
                  </div>
                )
              )}

            </div>
          ) : (
            !isLoading &&
            !loadError && (
              <div className="new-in-page__empty">
                <p>
                  {allProducts.length === 0
                    ? "No new arrivals yet — tag a product \"New In\" from your admin routes."
                    : "No products match your selected filters."}
                </p>

                {allProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )
          )}
        </section>

      </section>
    </main>
  );
}

export default Newinpage;
