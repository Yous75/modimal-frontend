import { useWishlist } from '../../context/WishlistContext';
import Sellercard from '../utils/sellercard/Sellercard';
import './Wishlist.css';

const Wishlist = () => {
  const { items, count, removeItem } = useWishlist();

  // Sellercard calls this whenever its heart is clicked. Since every card
  // here starts out liked, an un-favorite (next === false) means the item
  // should drop out of the wishlist immediately.
  const handleToggleLike = (id, liked) => {
    if (!liked) {
      removeItem(id);
    }
  };

  return (
    <section className="wishlist">
      <header className="wishlist__header">
        <h1 className="wishlist__title">My Wish List</h1>
        <p className="wishlist__count">
          {count} {count === 1 ? 'Item' : 'Items'}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="wishlist__empty">
          <p className="wishlist__empty-title">Your wishlist is empty</p>
          <p className="wishlist__empty-subtitle">
            Tap the heart on any item to save it here.
          </p>
        </div>
      ) : (
        <div className="wishlist__grid">
          {items.map((item) => (
            <Sellercard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              price={item.price}
              image={item.image}
              colors={item.colors}
              isLiked
              onToggleLike={handleToggleLike}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishlist;