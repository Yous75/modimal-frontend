import { useEffect, useState } from 'react';
import Sellercard from '../utils/sellercard/Sellercard';
import { getProducts } from '../../api/products';
import { normalizeProducts } from '../utils/normalizeProduct';
import { useWishlist } from '../../context/WishlistContext';
import './Bestsellers.css';
import { Link } from "react-router-dom";

// How many best sellers to show on the homepage section.
const MAX_PRODUCTS = 6;

// Component that displays the Best Sellers section.
// Products come from the backend (GET /products) and are narrowed down to
// the ones tagged "Best Seller" on the server.
const Bestsellers = () => {
  const { isInWishlist, toggleItem } = useWishlist();

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
        const bestSellers = normalizeProducts(data)
          .filter((product) => product.isBestSeller)
          .slice(0, MAX_PRODUCTS);
        setProducts(bestSellers);
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

  return (
    <section
      className="bestsellers"
      aria-labelledby="bestsellers-heading"
    >

      {/* Section title and "View All" link */}
      <div className="bestsellers__header">
        <h2 id="bestsellers-heading" className="bestsellers__title">
          Best Sellers
        </h2>

        <Link to="/best-seller" className="bestsellers__view-all">
          View All
        </Link>
      </div>

      {isLoading && (
        <p className="bestsellers__status">Loading best sellers…</p>
      )}

      {!isLoading && loadError && (
        <p className="bestsellers__status">{loadError}</p>
      )}

      {!isLoading && !loadError && products.length === 0 && (
        <p className="bestsellers__status">
          No best sellers yet — tag a product "Best Seller" from your admin routes.
        </p>
      )}

      {/* Creates a Sellercard for every fetched product */}
      {!isLoading && !loadError && products.length > 0 && (
        <div className="bestsellers__grid">
          {products.map((product) => (
            <Sellercard
              key={product.id}
              {...product}
              isLiked={isInWishlist(product.id)}
              onToggleLike={() => toggleItem(product)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Bestsellers;
