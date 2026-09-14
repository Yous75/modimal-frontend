import { useEffect, useRef, useState } from 'react';
import Modiweekcard from '../utils/modiweekcard/Modiweekcard';
import { getProducts } from '../../api/products';
import { normalizeProducts } from '../utils/normalizeProduct';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import './Modiweek.css';

// Modiweek pairs one real product with each day of the week. The backend
// has no "day of the week" concept, so this is just an editorial ordering
// of real catalog products, cycling through them if there are fewer than
// 7 in stock.
const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const Modiweek = () => {
  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem } = useCart();

  // reference container initialized to null
  const trackRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);
    setLoadError('');

    getProducts()
      .then((data) => {
        if (isCancelled) return;
        setProducts(normalizeProducts(data));
      })
      .catch(() => {
        if (!isCancelled) setLoadError("Couldn't load this week's picks.");
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // One product per day, cycling through the catalog if it has fewer
  // than 7 items.
  const modiweekData = products.length
    ? DAYS.map((day, index) => ({
        day,
        product: products[index % products.length],
      }))
    : [];

  //  Scroll function
  const handleScroll = (direction) => {
    const track = trackRef.current;  //Retrieves the actual <div> element stored in our reference.
    if (!track) return;

    // Card width (232px) + gap (20px) = 252px total distance per click
    const scrollAmount = 252;

    track.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleAddToCart = (product) => {
    addItem(product, {
      size: product.sizes?.[0],
      color: product.colorNames?.[0],
      qty: 1,
    });
  };

  return (
    <section className="modiweek" aria-label="Modiweek, outfit of the day">
      {/* Header section containing title and arrow controls */}
      <div className="modiweek__header">
        <h2 className="modiweek__heading">Modiweek</h2>

        <div className="modiweek__controls">
          <button
            type="button"
            className="modiweek__arrow"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            &#8249;
          </button>
          <button
            type="button"
            className="modiweek__arrow"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            &#8250;
          </button>
        </div>
      </div>

      {isLoading && <p className="modiweek__status">Loading this week's picks…</p>}

      {!isLoading && loadError && (
        <p className="modiweek__status">{loadError}</p>
      )}

      {!isLoading && !loadError && modiweekData.length === 0 && (
        <p className="modiweek__status">
          No products in the catalog yet — add some from your admin routes.
        </p>
      )}

      {/* Horizontally scrollable container holding all cards */}
      {!isLoading && !loadError && modiweekData.length > 0 && (
        <div className="modiweek__track" ref={trackRef} role="list">
          {modiweekData.map(({ day, product }) => (
            <div className="modiweek__item" role="listitem" key={day}>
              <Modiweekcard
                id={product.id}
                day={day}
                image={product.image}
                alt={`${product.title} - ${product.subtitle}`}
                subtitle={product.subtitle}
                price={product.price}
                isLiked={isInWishlist(product.id)}
                onToggleLike={() => toggleItem(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Modiweek;
