
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SellerCard from "../utils/sellercard/Sellercard";
import categoryData from "../../data/categoryData";
import { getProducts } from "../../api/products";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import "./CategoryPage.css";

const PRODUCTS_PER_PAGE = 6;

// Controls the order of the filter sections in the sidebar.
const FILTER_SECTIONS = [
  { key: "sortBy", label: "Sort By" },
  { key: "size", label: "Size" },
  { key: "colors", label: "Color" },
  { key: "collection", label: "Collection" },
  { key: "fabric", label: "Fabric" },
];

// Converts a backend product into the format expected by SellerCard.
function normalizeProduct(product) {
  return {
    id: product._id,
    title: product.title,
    subtitle: product.subtitle,
    price: product.price,
    image: product.images?.[0],
    colors: (product.colors || []).map((color) => color.hex),
    sizes: product.sizes || [],
  };
}

// Reusable category listing page.
// Static page content comes from categoryData.js.
// Products are loaded from the backend using the category slug.
//
// Examples:
// /collection/pants
// /collection/dresses-jumpsuits
// /collection/outerwear-jackets
// /collection/tees
// /collection/shorts-skirts
// /collection/blouses-tops
//
// A categoryKey prop can also be passed directly when needed.
function CategoryPage({ categoryKey }) {
  const { categorySlug } = useParams();
  const slug = categoryKey || categorySlug;
  const category = categoryData[slug];

  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem } = useCart();

  const [openSections, setOpenSections] = useState({
    sortBy: true,
  });

  const [activeTags, setActiveTags] = useState(
    category?.activeTags ?? []
  );

  const [visibleCount, setVisibleCount] =
    useState(PRODUCTS_PER_PAGE);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Loads products whenever the selected category changes.
  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);
    setLoadError("");

    getProducts({ category: slug })
      .then((data) => {
        setProducts(data.map(normalizeProduct));
      })
      .catch(() => {
        setLoadError("Couldn't load products right now.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  // Shows only the currently requested number of products.
  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount]
  );

  // Displays a fallback if the URL contains an unknown category.
  if (!category) {
    return (
      <div className="category-page category-page--empty">
        <p>We couldn't find that category.</p>
      </div>
    );
  }

  const hasMore = visibleCount < products.length;

  // Opens or closes a filter section.
  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Removes one active filter tag.
  const removeTag = (tag) => {
    setActiveTags((prev) =>
      prev.filter((item) => item !== tag)
    );
  };

  // Removes all active filter tags.
  const clearAllTags = () => {
    setActiveTags([]);
  };

  // Displays six additional products.
  const loadMore = () => {
    setVisibleCount(
      (count) => count + PRODUCTS_PER_PAGE
    );
  };

  // Adds a product using its first available size and color.
  // A product detail page can later allow the shopper to choose
  // these options manually.
  const handleAddToCart = (product) => {
    addItem(product, {
      size: product.sizes?.[0]?.size,
      color: product.colors?.[0],
      qty: 1,
    });
  };

  return (
    <div className="category-page">
      {/* Breadcrumb navigation */}
      <nav
        className="category-breadcrumb"
        aria-label="Breadcrumb"
      >
        <span>Home</span>

        <span className="category-breadcrumb__sep">
          /
        </span>

        <span className="category-breadcrumb__current">
          {category.breadcrumb}
        </span>
      </nav>

      {/* Category hero banners */}
      <div className="category-hero">
        {category.heroImages.map((img, idx) => (
          <div
            className="category-hero__image"
            key={idx}
          >
            <img
              src={img.src}
              alt={img.alt || category.name}
            />
          </div>
        ))}
      </div>

      

      <div className="category-body">

        {/* Filter sidebar */}
        <aside className="category-filters">

          <h2 className="category-filters__title">
            Filters
          </h2>

          {/* Active filter tags */}
          {activeTags.length > 0 && (
            <div className="category-filters__tags">

              {activeTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="filter-tag"
                  onClick={() => removeTag(tag)}
                >
                  {tag}

                  <span aria-hidden="true">
                    ✕
                  </span>
                </button>
              ))}

              <button
                type="button"
                className="filter-tag filter-tag--clear"
                onClick={clearAllTags}
              >
                Clear All Filters
              </button>

            </div>
          )}

          {/* Filter accordion sections */}
          {FILTER_SECTIONS.map(({ key, label }) => {
            const options = category.filters?.[key];

            if (!options || options.length === 0) {
              return null;
            }

            const isOpen = !!openSections[key];
            const panelId = `filter-panel-${slug}-${key}`;

            return (
              <div
                className="filter-accordion"
                key={key}
              >

                <button
                  type="button"
                  className="filter-accordion__header"
                  onClick={() => toggleSection(key)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span>{label}</span>

                  <span
                    className={`filter-accordion__icon${
                      isOpen ? " is-open" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="filter-accordion__panel"
                    id={panelId}
                  >

                    {/* Color filters use color swatches */}
                    {key === "colors" ? (
                      <div className="filter-swatches">

                        {options.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            className="filter-swatch"
                            style={{
                              backgroundColor: color.hex,
                            }}
                            title={color.name}
                            aria-label={color.name}
                          />
                        ))}

                      </div>
                    ) : (
                      <ul className="filter-options">

                        {options.map((option) => (
                          <li key={option}>

                            <label className="filter-option">

                              <input
                                type="checkbox"
                              />

                              <span>
                                {option}
                              </span>

                            </label>

                          </li>
                        ))}

                      </ul>
                    )}

                  </div>
                )}

              </div>
            );
          })}

        </aside>

        {/* Product results */}
        <div className="category-results">

          {isLoading && (
            <p className="category-status">
              Loading products…
            </p>
          )}

          {loadError && (
            <p className="category-status">
              {loadError}
            </p>
          )}

          {!isLoading &&
            !loadError &&
            products.length === 0 && (
              <p className="category-status">
                No products in this category yet — add
                some from your admin routes in Postman.
              </p>
            )}

          {/* Product grid */}
          <div className="category-grid">

            {visibleProducts.map((product) => (
              <SellerCard
                key={product.id}
                {...product}
                isLiked={isInWishlist(product.id)}
                onToggleLike={() =>
                  toggleItem(product)
                }
                onAddToCart={() =>
                  handleAddToCart(product)
                }
              />
            ))}

          </div>

          {/* Load more button */}
          {hasMore && (
            <div className="category-loadmore">

              <button
                type="button"
                className="category-loadmore__btn"
                onClick={loadMore}
              >
                Load More
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default CategoryPage;

