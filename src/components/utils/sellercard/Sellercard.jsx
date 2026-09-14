import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sellercard.css';

// Maximum number of color circles displayed on the card
const MAX_VISIBLE_SWATCHES = 5;

// Formats the price as USD currency
const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

const Sellercard = ({
  id,
  title,
  subtitle,
  price,
  image,
  isLiked = false,
  colors = [],
  onToggleLike,
  onAddToCart,
}) => {

  // Stores which color swatch is currently selected
  const [activeSwatch, setActiveSwatch] = useState(null);

  // Displays only the first 5 colors
  const visibleColors = colors.slice(0, MAX_VISIBLE_SWATCHES);

  // Calculates how many colors are hidden
  const hiddenCount = colors.length - visibleColors.length;

  // Handles clicking the heart button. `isLiked` now comes from the parent
  // (backed by WishlistContext) instead of being tracked locally, so the
  // heart always reflects the real wishlist state.
  const handleToggleLiked = (e) => {
    // The heart sits on top of the card's Link to the product page --
    // stop the click from also navigating there.
    e.preventDefault();
    e.stopPropagation();
    onToggleLike?.(id, !isLiked);
  };

  // Handles clicking a color swatch
  const handleSwatchClick = (index) => {
    // Clicking the same color again deselects it
    setActiveSwatch((prev) => (prev === index ? null : index));
  };

  return (
    <article className="sellercard">

      <Link to={`/product/${id}`} className="sellercard__link">

        {/* Product image and wishlist button */}
        <div className="sellercard__media">
          <img
            src={image}
            alt={`${title} - ${subtitle}`}
            className="sellercard__image"
            loading="lazy"
          />

          {/* Heart button for adding/removing the product from wishlist */}
          <button
            type="button"
            className={`sellercard__like${isLiked ? ' sellercard__like--active' : ''}`}
            onClick={handleToggleLiked}
            aria-pressed={isLiked}
            aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              viewBox="0 0 24 24"
              className="sellercard__heart-icon"
              aria-hidden="true"
            >
              <path d="M12 20.35c-.2 0-.39-.07-.55-.2C9.53 18.6 3 13.36 3 8.5 3 5.74 5.24 3.5 8 3.5c1.74 0 3.28.88 4 2.2.72-1.32 2.26-2.2 4-2.2 2.76 0 5 2.24 5 5 0 4.86-6.53 10.1-8.45 11.65-.16.13-.35.2-.55.2Z" />
            </svg>
          </button>
        </div>

        {/* Product name, subtitle and price */}
        <div className="sellercard__info">
          <h3 className="sellercard__title">{title}</h3>

          <div className="sellercard__meta">
            <p className="sellercard__subtitle">{subtitle}</p>
            <p className="sellercard__price">{formatPrice(price)}</p>
          </div>
        </div>

      </Link>

      {/* Displays the color options only if colors are available */}
      {colors.length > 0 && (
        <div
          className="sellercard__swatches"
          role="group"
          aria-label="Available colors"
        >

          {/* Creates one button for each visible color */}
          {visibleColors.map((color, index) => (
            <button
              key={`${color}-${index}`}
              type="button"
              className={`sellercard__swatch${
                activeSwatch === index
                  ? ' sellercard__swatch--active'
                  : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleSwatchClick(index)}
              aria-pressed={activeSwatch === index}
              aria-label={`Color ${index + 1}`}
            />
          ))}

          {/* Shows how many additional colors are hidden */}
          {hiddenCount > 0 && (
            <span className="sellercard__swatch-more">
              +{hiddenCount}
            </span>
          )}
        </div>
      )}

      {/* Adds this product to the cart using its first available size/color.
          Only shows up if the parent passed a handler for it. */}
      {onAddToCart && (
        <button
          type="button"
          className="sellercard__add-to-cart"
          onClick={() => onAddToCart(id)}
        >
          Add To Cart
        </button>
      )}
    </article>
  );
};

export default Sellercard;