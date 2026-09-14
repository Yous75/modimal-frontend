import Sellercard from '../sellercard/Sellercard';
import './Modiweekcard.css';

/**
 * Modiweekcard
 * A thin wrapper around the existing, reusable Sellercard component.
 * It reuses all of Sellercard's logic (wishlist toggle, image, etc.)
 * but re-skins it via scoped CSS (see Modiweekcard.css) and layers on
 * two Modiweek-specific features that Sellercard doesn't have:
 *   1. A portrait (3:4) image crop 
 *   2. A green "Add to Cart" button that reveals on hover
 *
 * Because all overrides live under the `.modiweekcard` class, the
 * original Sellercard (used elsewhere, e.g. Best Sellers) is untouched.
 */
const Modiweekcard = ({
  id,
  day,
  image,
  alt,
  subtitle = '',
  price = 0,
  isLiked = false,
  onToggleLike,
  onAddToCart,
}) => {
  return (
    <div className="modiweekcard">
      <Sellercard
        id={id}
        title={day}
        subtitle={subtitle}
        price={price}
        image={image}
        isLiked={isLiked}
        onToggleLike={onToggleLike}
      />

      <button
        type="button"
        className="modiweekcard__addtocart"
        onClick={onAddToCart}
      >
        Add to Cart
      </button>

      {/* Preserve descriptive alt text for screen readers without
          rendering it visually - Sellercard already builds its own
          alt from title/subtitle, this just documents intent. */}
      <span className="modiweekcard__sr-only">{alt}</span>
    </div>
  );
};

export default Modiweekcard;