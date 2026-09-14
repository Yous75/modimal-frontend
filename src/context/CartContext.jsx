import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getCart,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
} from "../api/cart";

const CartContext = createContext(null);

const GUEST_CART_KEY = "modimal_guest_cart";

// Turns a backend cart line ({ product: {...}, size, color, qty }) into the
// flat shape Cart.jsx already expects: { id, name, image, price, size, color, qty }.
function normalizeServerItem(line) {
  return {
    id: line.product._id,
    name: line.product.title,
    image: line.product.images?.[0],
    price: line.product.price,
    size: line.size,
    color: line.color,
    qty: line.qty,
  };
}

/**
 * Wrap your app with this provider so any page can add/remove items from
 * the cart, not just Cart.jsx itself.
 *
 * - Logged-in shoppers: the cart lives on the backend (MongoDB), so it's
 *   the same cart no matter what device they're on.
 * - Guests: the cart just lives in localStorage on this browser, so it
 *   survives a page refresh but doesn't follow them anywhere else.
 */
export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const refreshCart = useCallback(async () => {
    if (!token) return;
    const serverItems = await getCart();
    setItems(serverItems.map(normalizeServerItem));
  }, [token]);

  // As soon as we're logged in, load the real cart from the backend
  // (this replaces whatever was in the guest cart).
  useEffect(() => {
    if (token) refreshCart();
  }, [token, refreshCart]);

  // Guests keep their cart in localStorage so it survives a page refresh.
  useEffect(() => {
    if (!token) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    }
  }, [items, token]);

  const addItem = useCallback(
    async (product, { size, color, qty = 1 } = {}) => {
      if (token) {
        await addToCartApi({ productId: product.id, size, color, qty });
        await refreshCart();
      } else {
        setItems((prev) => {
          const existing = prev.find(
            (i) => i.id === product.id && i.size === size && i.color === color
          );
          if (existing) {
            return prev.map((i) =>
              i === existing ? { ...i, qty: i.qty + qty } : i
            );
          }
          return [
            ...prev,
            {
              id: product.id,
              name: product.title,
              image: product.image,
              price: product.price,
              size,
              color,
              qty,
            },
          ];
        });
      }
    },
    [token, refreshCart]
  );

  const removeItem = useCallback(
    async (id) => {
      if (token) {
        await removeFromCartApi(id);
        await refreshCart();
      } else {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    },
    [token, refreshCart]
  );

  // There's no "update quantity" endpoint on the backend — we just remove
  // the line and re-add it with the new quantity. Simple, if not the most
  // efficient, and easy to follow.
  const updateQty = useCallback(
    async (id, delta) => {
      const current = items.find((i) => i.id === id);
      if (!current) return;
      const newQty = Math.max(1, current.qty + delta);

      if (token) {
        await removeFromCartApi(id);
        await addToCartApi({
          productId: id,
          size: current.size,
          color: current.color,
          qty: newQty,
        });
        await refreshCart();
      } else {
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, qty: newQty } : i))
        );
      }
    },
    [items, token, refreshCart]
  );

  // Called once an order has been placed successfully.
  const clearCart = useCallback(async () => {
    if (token) {
      await Promise.all(items.map((i) => removeFromCartApi(i.id)));
      await refreshCart();
    } else {
      setItems([]);
      localStorage.removeItem(GUEST_CART_KEY);
    }
  }, [token, items, refreshCart]);

  const value = {
    items,
    count: items.reduce((sum, i) => sum + i.qty, 0),
    addItem,
    removeItem,
    updateQty,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
};

export default CartContext;