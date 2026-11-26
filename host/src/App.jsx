import { lazy, Suspense, useEffect, useState } from "react";
import RemoteErrorBoundary from "./RemoteErrorBoundary.jsx";

// These specifiers are mapped to remoteEntry.js files by Module Federation.
const ProductList = lazy(() => import("products/ProductList"));
const Cart = lazy(() => import("cart/Cart"));

const routes = {
  home: "#/home",
  products: "#/products",
  cart: "#/cart",
};

function getCurrentRoute() {
  const hash = window.location.hash;
  return Object.values(routes).includes(hash) ? hash : routes.home;
}

export default function App() {
  // The host owns shared state; remotes receive data and actions through props.
  const [cartItems, setCartItems] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(getCurrentRoute);

  // The browser changes its hash when a navigation link is clicked or Back is used.
  useEffect(() => {
    function syncRouteWithHash() {
      setCurrentRoute(getCurrentRoute());
    }

    window.addEventListener("hashchange", syncRouteWithHash);
    return () => window.removeEventListener("hashchange", syncRouteWithHash);
  }, []);

  function addToCart(product) {
    setCartItems((currentItems) => [...currentItems, product]);
  }

  function removeFromCart(itemIndex) {
    setCartItems((currentItems) =>
      currentItems.filter((_, index) => index !== itemIndex),
    );
  }

  function navigationLinkClass(route) {
    return currentRoute === route ? "active-nav-link" : undefined;
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href={routes.home} aria-label="Market home">
          <span className="brand-mark">m</span>
          <span>market</span>
        </a>
        <nav aria-label="Main navigation">
          <a
            href={routes.home}
            className={navigationLinkClass(routes.home)}
            aria-current={currentRoute === routes.home ? "page" : undefined}
          >
            Home
          </a>
          <a
            href={routes.products}
            className={navigationLinkClass(routes.products)}
            aria-current={currentRoute === routes.products ? "page" : undefined}
          >
            Products
          </a>
          <a
            href={routes.cart}
            className={navigationLinkClass(routes.cart)}
            aria-current={currentRoute === routes.cart ? "page" : undefined}
          >
            Cart
          </a>
        </nav>
        <a className="cart-link" href={routes.cart}>
          Cart <span className="cart-count">{cartItems.length}</span>
        </a>
      </header>

      <main>
        {currentRoute === routes.home && (
          <section className="hero">
            <p className="eyebrow">A tiny shop, three independent apps</p>
            <h1>Good things for<br />everyday living.</h1>
            <p className="hero-copy">
              Browse a few thoughtful finds. This storefront is assembled from
              separately running microfrontends.
            </p>
            <a className="primary-link" href={routes.products}>
              Explore products <span aria-hidden="true">↓</span>
            </a>
            <div className="hero-orbit" aria-hidden="true">
              <span className="orbit-sun">✳</span>
              <span className="orbit-word">small<br />joys</span>
            </div>
          </section>
        )}

        {currentRoute === routes.products && (
          <section className="content-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">The collection</p>
                <h2>Picked for you</h2>
              </div>
              <span className="section-note">PRODUCTS REMOTE · :5001</span>
            </div>
            <RemoteErrorBoundary name="Products">
              <Suspense
                fallback={<p className="loading-message">Loading products…</p>}
              >
                <ProductList onAddToCart={addToCart} />
              </Suspense>
            </RemoteErrorBoundary>
          </section>
        )}

        {currentRoute === routes.cart && (
          <section className="cart-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your picks</p>
                <h2>Shopping cart</h2>
              </div>
              <span className="section-note">CART REMOTE · :5002</span>
            </div>
            <RemoteErrorBoundary name="Cart">
              <Suspense
                fallback={<p className="loading-message">Loading your cart…</p>}
              >
                <Cart items={cartItems} onRemoveItem={removeFromCart} />
              </Suspense>
            </RemoteErrorBoundary>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <span>market</span>
        <span>Navigation belongs to the host · feature data flows through props</span>
      </footer>
    </div>
  );
}
