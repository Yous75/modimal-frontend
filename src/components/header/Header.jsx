import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/Logo.png";
import SearchResults from "../searchresults/SearchResults";
import Cart from "../cart/Cart";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

// Import sample images
import blouseImg from "../../assets/blouses.jpg";
import plusSizeImg from "../../assets/plus-size.jpg";
import fallCollectionImg from "../../assets/fall-collection.jpg";
import whiteTeeImg from "../../assets/white-tee.jpg";
import blackDressImg from "../../assets/black-dress.jpg";
import plusPantsImg from "../../assets/plus-pants.jpg";
import plusWrapImg from "../../assets/plus-wrap.jpg";
import plusBlackImg from "../../assets/plus-black.jpg";
import sustainWhiteImg from "../../assets/sustain-white.jpg";
import sustainFabricImg from "../../assets/sustain-fabric.jpg";
import { useNavigate } from "react-router-dom";

const menuData = {
collection: {
columns: [
{
title: "Category",
links: [
"Shop All",
"Blouses & Tops",
"Pants",
"Dresses & Jumpsuits",
"Outerwear & Jackets",
"Tees",
"Shorts & Skirts",
],
},
{
title: "Featured",
links: ["New In", "Modiweek", "Plus Size", "Best Seller"],
},
{
title: "More",
links: [
"Fall Collection",

],
},
],

images: [
  {
    src: blouseImg,
    label: "Blouses",
  },
  {
    src: plusSizeImg,
    label: "Plus Size",
  },
],

},

newIn: {
columns: [
{
title: "Category",
links: [
"Shop All",
"Blouses & Tops",
"Tees",
"Pants",
"Outerwear & Jackets",
"Dresses & Jumpsuits",
"Shorts & Skirts",
],
},
{
title: "Trending",
links: [
"Plus Size",
"Fall Collection",
"Modiweek",
],
},
],

images: [
  {
    src: fallCollectionImg,
    label: "Fall Collection",
  },
  {
    src: whiteTeeImg,
    label: "Blouses",
  },
  {
    src: blackDressImg,
    label: "Dresses",
  },
],

},

plusSize: {
columns: [
{
title: "Category",
links: [
"Shop All in Plus Size",
"Blouses & Tops",
"Tees",
"Pants",
"Outerwear & Jackets",
"Dresses & Jumpsuits",
"Shorts & Skirts",
],
},
],

images: [
  {
    src: plusPantsImg,
    label: "Pants",
  },
  {
    src: plusWrapImg,
    label: "Dresses",
  },
  {
    src: plusBlackImg,
    label: "Blouses",
  },
],

},

sustainability: {
columns: [
{
title: "Sustainability",
links: [
"Mission",
"Processing",
"Materials",
"Packaging",
"Product Care",
"Our Suppliers",
],
},
],

images: [
  {
    src: sustainWhiteImg,
  },
  {
    src: sustainFabricImg,
  },
],

},
};

const menuLinkRoutes = {
collection: {
"Shop All": "/shop-all",

"Blouses & Tops": "/collection/blouses-tops",

Pants: "/collection/pants",

"Dresses & Jumpsuits":
  "/collection/dresses-jumpsuits",

"Outerwear & Jackets":
  "/collection/outerwear-jackets",

Tees: "/collection/tees",

"Shorts & Skirts":
  "/collection/shorts-skirts",

"Plus Size": "/plus-size",

"New In": "/new-in",

Modiweek: "/modiweek",

"Best Seller": "/best-seller",
"Fall Collection": "/fall-collection",

},

plusSize: {
"Shop All in Plus Size": "/plus-size",

"Blouses & Tops": "/collection/blouses-tops",

Pants: "/collection/pants",

Tees: "/collection/tees",

"Outerwear & Jackets":
  "/collection/outerwear-jackets",

"Dresses & Jumpsuits":
  "/collection/dresses-jumpsuits",

"Shorts & Skirts":
  "/collection/shorts-skirts",

},

sustainability: {
Mission: "/sustainability/mission",

Processing:
  "/sustainability/processing",

Materials:
  "/sustainability/materials",

Packaging:
  "/sustainability/packaging",

"Product Care":
  "/sustainability/product-care",

"Our Suppliers":
  "/sustainability/suppliers",

},

newIn: {
"Shop All": "/shop-all",

"Blouses & Tops":
  "/collection/blouses-tops",

Pants:
  "/collection/pants",

"Dresses & Jumpsuits":
  "/collection/dresses-jumpsuits",

"Outerwear & Jackets":
  "/collection/outerwear-jackets",

Tees:
  "/collection/tees",

"Shorts & Skirts":
  "/collection/shorts-skirts",

"Plus Size":
  "/plus-size",

Modiweek:
  "/modiweek",

},

};

function Header({
  
onWishlistClick,
onLogoClick,
onProfileClick,
}) {
 
const {
isLoggedIn,
user,
logout,
} = useAuth();

const { isDark, toggleTheme } = useTheme();

const [activeMenu, setActiveMenu] =
useState(null);

const [isSearchOpen, setIsSearchOpen] =
useState(false);

const [searchQuery, setSearchQuery] =
useState("");

const [isCartOpen, setIsCartOpen] =
useState(false);

const [cartCount, setCartCount] =
useState(0);

const searchInputRef =
useRef(null);

const handleNavClick = (menuKey, e) => {
e.preventDefault();

setIsSearchOpen(false);

setActiveMenu(
  activeMenu === menuKey
    ? null
    : menuKey
);

};

const closeOverlaysForRoute = () => {
setActiveMenu(null);
setIsSearchOpen(false);
};

const handleSearchToggle = (e) => {
e.preventDefault();

setActiveMenu(null);

setIsSearchOpen((prev) => {
  const next = !prev;

  if (!next) {
    setSearchQuery("");
  }

  return next;
});

};

const closeSearch = () => {
setIsSearchOpen(false);
setSearchQuery("");
};

const clearSearchQuery = () => {
setSearchQuery("");

searchInputRef.current?.focus();

};

const handleCartToggle = (e) => {
e.preventDefault();

setActiveMenu(null);
setIsSearchOpen(false);
setIsCartOpen(true);

};

useEffect(() => {
if (!isSearchOpen) return;

const handleKeyDown = (e) => {
  if (e.key === "Escape") {
    closeSearch();
  }
};

window.addEventListener(
  "keydown",
  handleKeyDown
);

return () => {
  window.removeEventListener(
    "keydown",
    handleKeyDown
  );
};

}, [isSearchOpen]);

useEffect(() => {
if (isSearchOpen) {
searchInputRef.current?.focus();
}
}, [isSearchOpen]);



return (
<header className="header-container">

  <h1 className="visually-hidden">
    Modimal
  </h1>

  <div>
    <p>
      Enjoy Free Shipping On All Orders
    </p>
  </div>

  <div className="header">

    <a
      href="#home"
      onClick={(e) => {
        e.preventDefault();

        onLogoClick?.();
      }}
    >
      <img
        id="logo"
        src={logo}
        alt="shop's logo"
      />
    </a>

    <nav>
      <ul>

        <li>
          <a
            href="#collection"
            onClick={(e) =>
              handleNavClick(
                "collection",
                e
              )
            }
            className={
              activeMenu === "collection"
                ? "active-link"
                : ""
            }
          >
            Collection
          </a>
        </li>

        <li>
          <Link
            to="/new-in"
            onClick={
              closeOverlaysForRoute
            }
          >
            New In
          </Link>
        </li>

        <li>
          <Link
            to="/modiweek"
            onClick={
              closeOverlaysForRoute
            }
          >
            Modiweek
          </Link>
        </li>

        <li>
          <a
            href="#plusSize"
            onClick={(e) =>
              handleNavClick(
                "plusSize",
                e
              )
            }
            className={
              activeMenu === "plusSize"
                ? "active-link"
                : ""
            }
          >
            Plus Size
          </a>
        </li>

        <li>
          <Link
            to="/best-seller"
            onClick={
              closeOverlaysForRoute
            }
          >
            Best Seller
          </Link>
        </li>

        <li>
          <a
            href="#sustainability"
            onClick={(e) =>
              handleNavClick(
                "sustainability",
                e
              )
            }
            className={
              activeMenu ===
              "sustainability"
                ? "active-link"
                : ""
            }
          >
            Sustainability
          </a>
        </li>

      </ul>
    </nav>

    <div className="header-icons">

      {isLoggedIn &&
        user?.role === "admin" && (
          <Link
            to="/admin"
            onClick={
              closeOverlaysForRoute
            }
            className="admin-dashboard-link"
            aria-label="Admin Dashboard"
          >
            <i className="fa-solid fa-gauge-high"></i>
          </Link>
        )}

      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label={
          isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
      >
        <i
          className={`fa-solid ${
            isDark ? "fa-sun" : "fa-moon"
          }`}
        ></i>
      </button>

      <a
        href="/search"
        onClick={handleSearchToggle}
        aria-label={
          isSearchOpen
            ? "Close search"
            : "Open search"
        }
        aria-expanded={
          isSearchOpen
        }
      >
        <i
          className={`fa-solid ${
            isSearchOpen
              ? "fa-xmark"
              : "fa-magnifying-glass"
          }`}
        ></i>
      </a>

      <a
        href="/profile"
        onClick={(e) => {
          e.preventDefault();

          setIsSearchOpen(false);
          setActiveMenu(null);

          if (isLoggedIn) {
            logout();
          } else {
            onProfileClick?.();
          }
        }}
        aria-label={
          isLoggedIn
            ? "Log out"
            : "Account"
        }
      >
        <i
          className={`fa-solid ${
            isLoggedIn
              ? "fa-right-from-bracket"
              : "fa-user"
          }`}
        ></i>
      </a>

      {isLoggedIn &&
        user?.role !== "admin" && (
          <Link
            to="/my-orders"
            onClick={
              closeOverlaysForRoute
            }
            className="my-orders-link"
            aria-label="My Orders"
          >
            <i className="fa-solid fa-box-open"></i>
          </Link>
        )}

      <a
        href="#wishlist"
        onClick={(e) => {
          e.preventDefault();

          onWishlistClick?.();
        }}
        aria-label="Wishlist"
      >
        <i className="fa-solid fa-heart"></i>
      </a>

      <a
        href="/cart"
        onClick={handleCartToggle}
        aria-label="Cart"
        className="header-cart-icon"
      >
        <i className="fa-solid fa-bag-shopping"></i>

        {cartCount > 0 && (
          <span className="cart-icon-badge">
            {cartCount}
          </span>
        )}
      </a>

    </div>
  </div>

  <div
    className={`search-bar-wrapper ${
      isSearchOpen
        ? "open"
        : ""
    }`}
  >
    <div className="search-bar-inner">

      <div className="search-bar-content">

        <i className="fa-solid fa-magnifying-glass search-bar-icon"></i>

        <input
          ref={searchInputRef}
          type="text"
          className="search-bar-input"
          placeholder="Search"
          aria-label="Search"
          tabIndex={
            isSearchOpen
              ? 0
              : -1
          }
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(
              e.target.value
            )
          }
        />

        {searchQuery.length > 0 && (
          <button
            type="button"
            className="search-bar-clear"
            onClick={
              clearSearchQuery
            }
            aria-label="Clear search"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}

      </div>

      {isSearchOpen && (
        <SearchResults
          query={searchQuery}
        />
      )}

    </div>
  </div>

  {activeMenu &&
    menuData[activeMenu] && (
      <div className="mega-menu">

        <div className="mega-menu-content">

          <div className="mega-menu-columns">

            {menuData[
              activeMenu
            ].columns.map(
              (col, idx) => (
                <div
                  key={idx}
                  className="mega-menu-column"
                >

                  <h3>
                    {col.title}
                  </h3>

                  <ul>

                    {col.links.map(
                      (
                        link,
                        linkIdx
                      ) => {

                        const routePath =
                          menuLinkRoutes[
                            activeMenu
                          ]?.[
                            link
                          ];

                        return (
                          <li
                            key={
                              linkIdx
                            }
                          >

                            {routePath ? (
                              <Link
                                to={
                                  routePath
                                }
                                onClick={
                                  closeOverlaysForRoute
                                }
                              >
                                {
                                  link
                                }
                              </Link>
                            ) : (
                              <a href="#">
                                {
                                  link
                                }
                              </a>
                            )}

                          </li>
                        );
                      }
                    )}

                  </ul>

                </div>
              )
            )}

          </div>

          <div className="mega-menu-images">

            {menuData[
              activeMenu
            ].images.map(
              (
                img,
                imgIdx
              ) => (
                <div
                  key={
                    imgIdx
                  }
                  className="mega-menu-card"
                >

                  <img
                    src={img.src}
                    alt={
                      img.label ||
                      "Menu banner"
                    }
                  />

                  {img.label && (
                    <span>
                      {
                        img.label
                      }
                    </span>
                  )}

                </div>
              )
            )}

          </div>

        </div>

      </div>
    )}

  {isSearchOpen && (
    <div
      className="search-overlay"
      onClick={closeSearch}
      aria-hidden="true"
    ></div>
  )}

  <Cart
    isOpen={isCartOpen}
    onClose={() =>
      setIsCartOpen(false)
    }
    onItemCountChange={
      setCartCount
    }
  />

</header>

);
}

export default Header;