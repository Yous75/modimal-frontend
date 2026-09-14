
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Hero from "./components/hero/Hero";
import Bestsellers from "./components/bestsellers/Bestsellers";
import Collection from "./components/collection/Collection";
import Modiweek from "./components/modiweek/Modiweek";
import Sustainlanding from "./components/sustainlanding/Sustainlanding";
import Followus from "./components/followus/Followus";

import Wishlist from "./components/wishlist/Wishlist";
import Myorders from "./components/myorders/Myorders";

import Register from "./components/register/Register";
import Login from "./components/login/Login";

import Sustainmission from "./components/sustainmission/Sustainmission";
import Substainmaterials from "./components/substainmaterials/Substainmaterials";

// Sustainability sub-pages
import Sustainprocess from "./components/sustainprocess/Sustainprocess";
import Sustainpack from "./components/sustainpack/Sustainpack";
import Sustainprocare from "./components/sustainprocare/Sustainprocare";
import Sustainsupply from "./components/sustainsupply/Sustainsupply";

import Contactus from "./components/contactus/Contactus";
import Faq from "./components/faq/Faq";

import Shopall from "./components/shopall/Shopall";
import Plussize from "./components/plussize/Plussize";
import Modiweekpage from "./components/modiweekpage/Modiweekpage";
import CategoryPage from "./components/categoryPage/CategoryPage";

// Best Seller and New In pages
import Bestsellerpage from "./components/bestsellerpage/Bestsellerpage";
import Newinpage from "./components/newinpage/Newinpage";

import Dashboard from "./components/dashboard/Dashboard";
import AdminRoute from "./components/adminroute/AdminRoute";

import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";

import Fallcollection from "./components/fallcollection/Fallcollection";
import PrivacyPolicy from "./components/privacypolicy/Privacypolicy";
import TermsConds from "./components/termsconds/Termsconds";
import Refunds from "./components/refunds/Refunds";
import Productpage from "./components/productpage/Productpage"

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Controls the welcome popup on the Register page
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const navigate = useNavigate();

  const goHome = () => {
    setShowRegister(false);
    setShowLogin(false);
    setShowWelcomeModal(false);
    navigate("/");
  };

  const openProfile = () => {
    setShowLogin(false);
    setShowRegister(true);
    setShowWelcomeModal(false);
    navigate("/");
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Header
              onWishlistClick={() => {
                setShowRegister(false);
                setShowLogin(false);
                setShowWelcomeModal(false);
                navigate("/wishlist");
              }}
              onProfileClick={openProfile}
              onLogoClick={goHome}
            />

            <Routes>
              {/* PRODUCT DETAIL — this is what product cards link to */}
              <Route path="/product/:id" element={<Productpage />} />
              {/* HOME */}
              <Route
                path="/"
                element={
                  showRegister ? (
                    <Register
                      onClose={goHome}
                      onSwitchToLogin={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                        setShowWelcomeModal(false);
                      }}
                      showWelcomeModal={showWelcomeModal}
                      setShowWelcomeModal={setShowWelcomeModal}
                    />
                  ) : showLogin ? (
                    <Login
                      onClose={goHome}
                      onSwitchToRegister={() => {
                        setShowLogin(false);
                        setShowRegister(true);

                        // Open the welcome popup when
                        // Create An Account is clicked
                        setShowWelcomeModal(true);
                      }}
                    />
                  ) : (
                    <>
                      <Hero />
                      <Bestsellers />
                      <Collection />
                      <Modiweek />
                      <Sustainlanding />
                      <Followus />
                    </>
                  )
                }
              />

              {/* BEST SELLER */}
              <Route
                path="/best-seller"
                element={<Bestsellerpage />}
              />

              {/* NEW IN */}
              <Route
                path="/new-in"
                element={<Newinpage />}
              />

              {/* WISHLIST */}
              <Route
                path="/wishlist"
                element={<Wishlist />}
              />

              {/* MY ORDERS */}
              <Route
                path="/my-orders"
                element={<Myorders />}
              />

              {/* SUSTAINABILITY */}
              <Route
                path="/sustainability/mission"
                element={<Sustainmission />}
              />

              <Route
                path="/sustainability/materials"
                element={<Substainmaterials />}
              />

              <Route
                path="/sustainability/processing"
                element={<Sustainprocess />}
              />

              <Route
                path="/sustainability/packaging"
                element={<Sustainpack />}
              />

              <Route
                path="/sustainability/product-care"
                element={<Sustainprocare />}
              />

              <Route
                path="/sustainability/suppliers"
                element={<Sustainsupply />}
              />

              {/* OTHER PAGES */}
              <Route
                path="/contact-us"
                element={<Contactus />}
              />

              <Route
                path="/faqs"
                element={<Faq />}
              />

              <Route
                path="/shop-all"
                element={<Shopall />}
              />

              <Route
                path="/plus-size"
                element={<Plussize />}
              />

              <Route
                path="/modiweek"
                element={<Modiweekpage />}
              />

              {/* CATEGORY PAGES */}
              <Route
                path="/collection/:categorySlug"
                element={<CategoryPage />}
              />

              {/* ADMIN DASHBOARD */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/fall-collection"
                element={<Fallcollection />}
              />

              <Route
                path="/privacy-policy"
                element={<PrivacyPolicy />}
              />

              <Route
                path="/terms-conditions"
                element={<TermsConds />}
              />

              <Route
                path="/refund-policy"
                element={<Refunds />}
              />
            </Routes>

            <Footer />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;