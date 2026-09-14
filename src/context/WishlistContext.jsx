import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist';

const WishlistContext = createContext(null);

// Turns a backend Product doc into the flat shape SellerCard/Wishlist.jsx expect.
function normalizeProduct(product) {
  return {
    id: product._id,
    title: product.title,
    subtitle: product.subtitle,
    price: product.price,
    image: product.images?.[0],
    colors: (product.colors || []).map((c) => c.hex),
  };
}

/**
 * Wrap your app (or the part of it that needs wishlist access) with this
 * provider, e.g. in App.jsx:
 *
 *   <WishlistProvider>
 *     <Header />
 *     <Routes>...</Routes>
 *   </WishlistProvider>
 *
 * `initialItems` is optional — pass in items already saved by the user
 * (from localStorage, an API call, etc.) if you have them.
 *
 * Guests keep their wishlist in memory only (same as before). As soon as
 * someone logs in, their saved wishlist loads from the backend, and every
 * add/remove after that is saved there too.
 */
export const WishlistProvider = ({ children, initialItems = [] }) => {
  const { token } = useAuth();
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    if (!token) return;
    getWishlist()
      .then((products) => setItems(products.map(normalizeProduct)))
      .catch(() => {
        // Nothing we can show the user here — worst case their wishlist
        // just doesn't load this time.
      });
  }, [token]);

  const isInWishlist = useCallback(
    (id) => items.some((item) => item.id === id),
    [items]
  );

  const addItem = useCallback(
    (product) => {
      setItems((prev) =>
        prev.some((item) => item.id === product.id) ? prev : [...prev, product]
      );
      if (token) {
        addToWishlist(product.id).catch(() => {});
      }
    },
    [token]
  );

  const removeItem = useCallback(
    (id) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (token) {
        removeFromWishlist(id).catch(() => {});
      }
    },
    [token]
  );

  const toggleItem = useCallback(
    (product) => {
      setItems((prev) => {
        const alreadyIn = prev.some((item) => item.id === product.id);
        if (token) {
          if (alreadyIn) {
            removeFromWishlist(product.id).catch(() => {});
          } else {
            addToWishlist(product.id).catch(() => {});
          }
        }
        return alreadyIn
          ? prev.filter((item) => item.id !== product.id)
          : [...prev, product];
      });
    },
    [token]
  );

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isInWishlist,
      addItem,
      removeItem,
      toggleItem,
    }),
    [items, isInWishlist, addItem, removeItem, toggleItem]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a <WishlistProvider>');
  }
  return ctx;
};

export default WishlistContext;