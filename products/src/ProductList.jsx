import { products } from "./products.js";
import "./ProductList.css";

// The component knows how to display products, but not where cart state is stored.
export default function ProductList({ onAddToCart }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <img className="product-image" src={product.image} alt={product.name} />
          <div className="product-details">
            <div className="product-title-row">
              <h3>{product.name}</h3>
              <span className="product-price">${product.price}</span>
            </div>
            <p>{product.description}</p>
            {/* Calling the host's callback sends the chosen product upward as data. */}
            <button type="button" onClick={() => onAddToCart(product)}>
              Add to cart <span aria-hidden="true">+</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
