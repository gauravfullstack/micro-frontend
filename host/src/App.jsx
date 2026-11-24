import { lazy, Suspense, useState } from "react";
import RemoteErrorBoundary from "./RemoteErrorBoundary.jsx";

// These specifiers are mapped to remoteEntry.js files by Module Federation.
const ProductList = lazy(() => import("products/ProductList"));
const Cart = lazy(() => import("cart/Cart"));

export default function App() {
  // The host owns shared state; remotes receive data and actions through props.
  const [cartItems, setCartItems] = useState([]);

  function addToCart(product) {
    setCartItems((currentItems) => [...currentItems, product]);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Market home">
          <span className="brand-mark">m</span>
          <span>market</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#products">Discover</a>
          <a href="#cart">Your cart</a>
        </nav>
        <a className="cart-link" href="#cart">
          Cart <span className="cart-count">{cartItems.length}</span>
        </a>
      </header>

      <main id="home">
        <section className="hero">
          <p className="eyebrow">A tiny shop, three independent apps</p>
          <h1>Good things for<br />everyday living.</h1>
          <p className="hero-copy">
            Browse a few thoughtful finds. This storefront is assembled from
            separately running microfrontends.
          </p>
          <a className="primary-link" href="#products">Explore products <span aria-hidden="true">↓</span></a>
          <div className="hero-orbit" aria-hidden="true">
            <span className="orbit-sun">✳</span>
            <span className="orbit-word">small<br />joys</span>
          </div>
        </section>

        <section id="products" className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The collection</p>
              <h2>Picked for you</h2>
            </div>
            <span className="section-note">PRODUCTS REMOTE · :5001</span>
          </div>
          <RemoteErrorBoundary name="Products">
            <Suspense fallback={<p className="loading-message">Loading products…</p>}>
              <ProductList onAddToCart={addToCart} />
            </Suspense>
          </RemoteErrorBoundary>
        </section>

        <section id="cart" className="cart-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your picks</p>
              <h2>Shopping cart</h2>
            </div>
            <span className="section-note">CART REMOTE · :5002</span>
          </div>
          <RemoteErrorBoundary name="Cart">
            <Suspense fallback={<p className="loading-message">Loading your cart…</p>}>
              <Cart items={cartItems} />
            </Suspense>
          </RemoteErrorBoundary>
        </section>
      </main>

      <footer className="site-footer">
        <span>market</span>
        <span>Host state → remote props → live cart update</span>
      </footer>
    </div>
  );
}
