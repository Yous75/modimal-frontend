
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Productpage.css";

import { getProduct, getProducts } from "../../api/products";
import { normalizeProduct } from "../utils/normalizeProduct";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const FALLBACK_SIZES = ["XS", "S", "M", "L", "XL"];

const MAX_RELATED = 4;

function Productpage() {
  const { id } = useParams();

  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [related, setRelated] = useState([]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeWarning, setSizeWarning] = useState(false);

  // Fetch the selected product whenever the URL ID changes.
  useEffect(() => {
    let isCurrent = true;

    setIsLoading(true);
    setError(null);
    setProduct(null);

    setSelectedImage(0);
    setSelectedColor(null);
    setSelectedSize("");
    setSizeWarning(false);
    setRelated([]);

    getProduct(id)
      .then((data) => {
        if (!isCurrent) return;

        setProduct(data);

        // Select the first available product color by default.
        setSelectedColor(data?.colors?.[0]?.hex ?? null);

        // Fetch other products from the same category.
        if (data?.category) {
          getProducts({ category: data.category })
            .then((list) => {
              if (!isCurrent) return;

              const others = list
                .filter((item) => item._id !== data._id)
                .slice(0, MAX_RELATED)
                .map(normalizeProduct);

              setRelated(others);
            })
            .catch(() => {
              // Related products are optional.
              // The main product can still be displayed.
            });
        }
      })
      .catch((err) => {
        if (!isCurrent) return;

        setError(err);
      })
      .finally(() => {
        if (!isCurrent) return;

        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  // Adds the selected product and options to the cart.
  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeWarning(true);
      return;
    }

    setSizeWarning(false);

    const colorName = product.colors?.find(
      (color) => color.hex === selectedColor
    )?.name;

    addItem(normalizeProduct(product), {
      size: selectedSize,
      color: colorName,
      qty: 1,
    });
  };

  // Loading state.
  if (isLoading) {
    return (
      <main className="pb-page">
        <p className="pb-description">Loading product…</p>
      </main>
    );
  }

  // Error state.
  if (error || !product) {
    return (
      <main className="pb-page">
        <p className="pb-description">
          We couldn't find that product.{" "}
          <Link to="/shop-all">Back to Shop All</Link>
        </p>
      </main>
    );
  }

  // Product gallery.
  const gallery = product.images?.length
    ? product.images
    : [];

  // Use backend sizes when available.
  // Otherwise, use the fallback sizes.
  const sizeEntries = product.sizes?.length
    ? product.sizes
    : FALLBACK_SIZES.map((size) => ({
        size,
        stock: 1,
      }));

  const colorOptions = product.colors || [];

  const isLiked = isInWishlist(product._id);

  return (
    <main className="pb-page">
      {/* Breadcrumb navigation */}
      <nav
        className="pb-breadcrumbs"
        aria-label="Breadcrumb"
      >
        <Link to="/">Home</Link>

        <span className="pb-breadcrumb-sep">/</span>

        <Link to="/shop-all">Shop All</Link>

        <span className="pb-breadcrumb-sep">/</span>

        <span className="pb-breadcrumb-current">
          {product.title}
        </span>
      </nav>

      {/* Main product section */}
      <section className="pb-product">
        {/* Product gallery */}
        <div className="pb-gallery">
          {/* Image thumbnails */}
          <div className="pb-thumbnails">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`pb-thumb ${
                  selectedImage === idx
                    ? "pb-thumb-active"
                    : ""
                }`}
                onClick={() => setSelectedImage(idx)}
                aria-label={`Show image ${idx + 1}`}
                aria-pressed={selectedImage === idx}
              >
                <img
                  src={img}
                  alt={`${product.title} view ${idx + 1}`}
                />
              </button>
            ))}
          </div>

          {/* Main product image */}
          <div className="pb-main-image">
            {gallery.length > 0 ? (
              <img
                src={gallery[selectedImage]}
                alt={product.title}
              />
            ) : (
              <div className="pb-no-image">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Product information and purchase options */}
        <div className="pb-details">
          <h1 className="pb-title">
            {product.title}
          </h1>

          {product.subtitle && (
            <p className="pb-subtitle">
              {product.subtitle}
            </p>
          )}

          <p className="pb-price">
            ${product.price}
          </p>

          {product.description && (
            <p className="pb-description">
              {product.description}
            </p>
          )}

          {/* Color selection */}
          {colorOptions.length > 0 && (
            <div className="pb-colors">
              <span className="pb-section-label">
                Colors
              </span>

              <div className="pb-color-swatches">
                {colorOptions.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    className={`pb-swatch ${
                      selectedColor === color.hex
                        ? "pb-swatch-active"
                        : ""
                    }`}
                    style={{
                      backgroundColor: color.hex,
                    }}
                    onClick={() =>
                      setSelectedColor(color.hex)
                    }
                    aria-label={color.name}
                    aria-pressed={
                      selectedColor === color.hex
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selection */}
          <div className="pb-size-row">
            <span className="pb-section-label">
              Size
            </span>
          </div>

          <select
            className="pb-size-select"
            value={selectedSize}
            onChange={(e) => {
              setSelectedSize(e.target.value);
              setSizeWarning(false);
            }}
            aria-label="Select size"
          >
            <option value="">Size</option>

            {sizeEntries.map((entry) => (
              <option
                key={entry.size}
                value={entry.size}
                disabled={entry.stock <= 0}
              >
                {entry.size}
                {entry.stock <= 0
                  ? " (Out of Stock)"
                  : ""}
              </option>
            ))}
          </select>

          {sizeWarning && (
            <p className="pb-size-warning">
              Please select a size.
            </p>
          )}

          {/* Add to cart */}
          <button
            type="button"
            className="pb-add-to-cart"
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>

          {/* Return and wishlist actions */}
          <div className="pb-sub-actions">
            <span className="pb-easy-return">
              <i
                className="fa-solid fa-truck-fast"
                aria-hidden="true"
              ></i>

              Easy Return
            </span>

            <button
              type="button"
              className="pb-wishlist-btn"
              onClick={() =>
                toggleItem(normalizeProduct(product))
              }
              aria-pressed={isLiked}
            >
              <i
                className={`fa-${
                  isLiked ? "solid" : "regular"
                } fa-heart`}
                aria-hidden="true"
              ></i>

              {isLiked
                ? "Added To Wish List"
                : "Add To Wish List"}
            </button>
          </div>

          {/* Fabric information */}
          {product.fabric && (
            <p className="pb-fabric">
              Fabric: {product.fabric}
            </p>
          )}
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="pb-recommendations">
          <h2 className="pb-recs-title">
            You May Also Like
          </h2>

          <div className="pb-recs-grid">
            {related.map((rec) => (
              <Link
                key={rec.id}
                to={`/product/${rec.id}`}
                className="pb-rec-card"
              >
                {/* Related product image */}
                <div className="pb-rec-image-wrap">
                  <img
                    src={rec.image}
                    alt={rec.title}
                  />
                </div>

                {/* Related product name */}
                <p className="pb-rec-name">
                  {rec.title}
                </p>

                {/* Related product metadata */}
                <div className="pb-rec-meta">
                  <span className="pb-rec-collection">
                    {rec.subtitle}
                  </span>

                  <span className="pb-rec-price">
                    ${rec.price}
                  </span>
                </div>

                {/* Related product colors */}
                <div className="pb-rec-colors">
                  {rec.colors?.map((hex, idx) => (
                    <span
                      key={idx}
                      className="pb-rec-color-dot"
                      style={{
                        backgroundColor: hex,
                      }}
                    />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Productpage;