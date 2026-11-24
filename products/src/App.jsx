import { useState } from "react";
import ProductList from "./ProductList.jsx";

// This small shell lets the remote be opened and checked without the host.
export default function App() {
  const [addedProduct, setAddedProduct] = useState("");

  return (
    <main className="standalone-products">
      <p className="standalone-label">PRODUCTS REMOTE · PORT 5001</p>
      <h1>Product list</h1>
      <p className="standalone-intro">
        In the host, the same component calls a host-owned cart callback.
      </p>
      {addedProduct && (
        <p className="standalone-notice" role="status">
          Added {addedProduct} (standalone preview only).
        </p>
      )}
      <ProductList onAddToCart={(product) => setAddedProduct(product.name)} />
    </main>
  );
}
