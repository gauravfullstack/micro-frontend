import { useState } from "react";
import Cart from "./Cart.jsx";

// The remote can also be visited on its own with a tiny local preview dataset.
export default function App() {
  const [items, setItems] = useState([]);

  function addSampleItem() {
    setItems((currentItems) => [
      ...currentItems,
      { id: "sample-mug", name: "Sample ceramic mug", price: 28 },
    ]);
  }

  function removeSampleItem(itemIndex) {
    setItems((currentItems) =>
      currentItems.filter((_, index) => index !== itemIndex),
    );
  }

  return (
    <main className="standalone-cart">
      <p className="standalone-label">CART REMOTE · PORT 5002</p>
      <h1>Your cart</h1>
      <p className="standalone-intro">
        The host passes its cart items to this component as props.
      </p>
      <Cart items={items} onRemoveItem={removeSampleItem} />
      <button className="sample-button" type="button" onClick={addSampleItem}>
        Add a sample item
      </button>
    </main>
  );
}
