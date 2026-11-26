import "./Cart.css";

// The host supplies the latest array on every render, so no shared store is needed.
export default function Cart({ items = [], onRemoveItem }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <span className="empty-bag" aria-hidden="true">↗</span>
        <p>Your cart is waiting for something lovely.</p>
      </div>
    );
  }

  return (
    <div className="cart-panel">
      <ul className="cart-items">
        {items.map((item, index) => (
          <li className="cart-item" key={`${item.id}-${index}`}>
            <img src={item.image} alt="" />
            <span className="cart-item-name">{item.name}</span>
            <span className="cart-item-price">${item.price.toFixed(2)}</span>
            {onRemoveItem && (
              <button
                className="cart-item-remove"
                type="button"
                onClick={() => onRemoveItem(index)}
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="cart-total">
        <span>Total <small>({items.length} {items.length === 1 ? "item" : "items"})</small></span>
        <strong>${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}
