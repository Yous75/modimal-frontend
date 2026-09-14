import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sellercard from "../utils/sellercard/Sellercard";
import { getProducts } from "../../api/products";
import { normalizeProducts } from "../utils/normalizeProduct";
import { useWishlist } from "../../context/WishlistContext";
import "./Bestsellerpage.css";

import bestSellerHero1 from "../../assets/fake-bestseller-hero1.jpg";
import bestSellerHero2 from "../../assets/fake-bestseller-hero2.jpg";

const FILTER_OPTIONS = {
  sortBy: [
    "Featured",
    "Best Seller",
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

function Bestsellerpage() {
  const { isInWishlist, toggleItem } = useWishlist();

  // Products fetched from the backend and narrowed down to the ones
  // tagged "Best Seller".
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Keeps track of opened filter accordions.
  const [openSections, setOpenSections] = useState({});

  // Keeps track of selected filter values.
  const [selectedFilters, setSelectedFilters] = useState({
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
        const bestSellers = normalizeProducts(data).filter(
          (product) => product.isBestSeller
        );
        setAllProducts(bestSellers);
      })
      .catch(() => {
        if (!isCancelled) setLoadError("Couldn't load best sellers right now.");
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
          ? values.filter((item) => item !== value)
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
  const visibleProducts = allProducts.filter((product) => {
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
      !selectedFilters.fabric.includes(product.fabric)
    ) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    const sort = selectedFilters.sortBy[0];

    if (sort === "Price: Low To High") {
      return a.price - b.price;
    }

    if (sort === "Price: High To Low") {
      return b.price - a.price;
    }

    return 0;
  });

  return (
    <main className="best-seller-page">

      {/* Breadcrumb navigation */}
      <nav
        className="best-seller-page__breadcrumb"
        aria-label="Breadcrumb"
      >
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Best Seller</span>
      </nav>

      {/* Two-column editorial hero banner */}
      <section
        className="best-seller-page__hero"
        aria-label="Best Seller"
      >
        <div className="best-seller-page__hero-item">
          <img
            src={bestSellerHero1}
            alt="Best seller editorial look 1"
          />
        </div>

        <div className="best-seller-page__hero-item">
          <img
            src={bestSellerHero2}
            alt="Best seller editorial look 2"
          />
        </div>
      </section>

      {/* Sidebar filters and reusable product cards */}
      <section className="best-seller-page__content">

        <aside
          className="best-seller-page__sidebar"
          aria-label="Filters"
        >
          <div className="best-seller-page__filter-heading">
            <h2>Filters</h2>

            {Object.values(selectedFilters).some(
              (values) => values.length > 0
            ) && (
              <button
                type="button"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>

          {Object.entries(FILTER_OPTIONS).map(
            ([key, options]) => (
              <div
                className="best-seller-page__filter-section"
                key={key}
              >
                <button
                  type="button"
                  className="best-seller-page__filter-button"
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
                  <div className="best-seller-page__filter-body">

                    {options.map((option) => (
                      <label
                        className="best-seller-page__filter-option"
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

                        <span>{option}</span>
                      </label>
                    ))}

                  </div>
                )}
              </div>
            )
          )}
        </aside>

        <section
          className="best-seller-page__products"
          aria-label="Best Seller products"
        >
          {isLoading && (
            <p className="best-seller-page__status">
              Loading best sellers…
            </p>
          )}

          {!isLoading && loadError && (
            <p className="best-seller-page__status">
              {loadError}
            </p>
          )}

          {!isLoading && !loadError && visibleProducts.length ? (
            <div className="best-seller-page__grid">

              {visibleProducts.map((product) => (
                <div
                  className="best-seller-page__card-wrap"
                  key={product.id}
                >
                  <span className="best-seller-page__badge">
                    BEST
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
              ))}

            </div>
          ) : (
            !isLoading &&
            !loadError && (
              <div className="best-seller-page__empty">
                <p>
                  {allProducts.length === 0
                    ? "No best sellers yet — tag a product \"Best Seller\" from your admin routes."
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

export default Bestsellerpage;
