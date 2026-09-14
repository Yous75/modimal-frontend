import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sellercard from "../utils/sellercard/Sellercard";
import { getProducts } from "../../api/products";
import { normalizeProducts } from "../utils/normalizeProduct";
import { useWishlist } from "../../context/WishlistContext";
import "./Modiweekpage.css";

// Hero banner images -- one per day. There's no "day of the week" field
// on the backend Product model, so which two real products are paired
// with each day is just an editorial cycling order (see buildWeeklyLooks
// below); only these hero photos and the day labels themselves stay static.
import sundayHero from "../../assets/sunday-hero.jpg";
import mondayHero from "../../assets/monday-hero.jpg";
import tuesdayHero from "../../assets/tuesday-hero.jpg";
import wednesdayHero from "../../assets/wednesday-hero.jpg";
import thursdayHero from "../../assets/thursday-hero.jpg";
import fridayHero from "../../assets/friday-hero.jpg";
import saturdayHero from "../../assets/saturday-hero.jpg";

const DAYS = [
  { day: "Sunday", heroImage: sundayHero },
  { day: "Monday", heroImage: mondayHero },
  { day: "Tuesday", heroImage: tuesdayHero },
  { day: "Wednesday", heroImage: wednesdayHero },
  { day: "Thursday", heroImage: thursdayHero },
  { day: "Friday", heroImage: fridayHero },
  { day: "Saturday", heroImage: saturdayHero },
];

const PRODUCTS_PER_DAY = 2;

// Pairs 2 real products with each day of the week, cycling through the
// catalog if there aren't enough products yet.
function buildWeeklyLooks(products) {
  if (products.length === 0) return [];

  return DAYS.map(({ day, heroImage }, dayIndex) => {
    const dayProducts = Array.from({ length: PRODUCTS_PER_DAY }, (_, i) => {
      const productIndex = (dayIndex * PRODUCTS_PER_DAY + i) % products.length;
      return products[productIndex];
    });

    return { day, heroImage, products: dayProducts };
  });
}

function Modiweekpage() {
  const { isInWishlist, toggleItem } = useWishlist();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);
    setLoadError("");

    getProducts()
      .then((data) => {
        if (isCancelled) return;
        setProducts(normalizeProducts(data));
      })
      .catch(() => {
        if (!isCancelled) setLoadError("Couldn't load this week's looks.");
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const weeklyLooks = buildWeeklyLooks(products);

  const todayIndex = new Date().getDay();
  const [selectedIndex, setSelectedIndex] = useState(todayIndex);

  const selectedLook = weeklyLooks[selectedIndex];
  const itemCount = selectedLook?.products.length || 0;

  return (
    <main className="modiweek-page">
      <nav className="modiweek-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="modiweek-breadcrumb-sep">/</span>
        <span className="modiweek-breadcrumb-current">Modiweek</span>
      </nav>

      {isLoading && <p className="modiweek-status">Loading this week's looks…</p>}

      {!isLoading && loadError && (
        <p className="modiweek-status">{loadError}</p>
      )}

      {!isLoading && !loadError && weeklyLooks.length === 0 && (
        <p className="modiweek-status">
          No products in the catalog yet — add some from your admin routes.
        </p>
      )}

      {!isLoading && !loadError && selectedLook && (
        <>
          <h1 className="modiweek-day-heading">{selectedLook.day}</h1>

          <section className="modiweek-hero">
            <div className="modiweek-hero-image">
              <img
                src={selectedLook.heroImage}
                alt={`${selectedLook.day} featured look`}
              />
            </div>

            <div className="modiweek-shop-look">
              <div className="modiweek-shop-look-title">
                <h2>Shop The Look</h2>
                <span>
                  {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </span>
              </div>

              <div className="modiweek-product-grid">
                {selectedLook.products.map((product) => (
                  <Sellercard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    subtitle={product.subtitle}
                    price={product.price}
                    image={product.image}
                    colors={product.colors}
                    isLiked={isInWishlist(product.id)}
                    onToggleLike={() => toggleItem(product)}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="modiweek-week-strip" aria-label="Shop by day">
            <div className="modiweek-week-scroll">
              {weeklyLooks.map((look, index) => (
                <button
                  key={look.day}
                  type="button"
                  className={`modiweek-day-card${
                    index === selectedIndex ? " is-active" : ""
                  }`}
                  onClick={() => setSelectedIndex(index)}
                  aria-pressed={index === selectedIndex}
                >
                  <div className="modiweek-day-card-image">
                    <img src={look.heroImage} alt={`${look.day} look`} />
                    <span className="modiweek-day-card-heart" aria-hidden="true">
                      <i className="fa-regular fa-heart"></i>
                    </span>
                    {index === todayIndex && (
                      <span className="modiweek-day-card-today">Today</span>
                    )}
                  </div>
                  <span className="modiweek-day-card-label">{look.day}</span>
                </button>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Modiweekpage;
