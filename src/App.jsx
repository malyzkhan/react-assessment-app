
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function fetchProducts() {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load products");
      }

      setProducts(result.data);
    } catch (err) {
      setMessage(err.message || "Could not connect to the server");
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handlePurchase(productId) {
    setBuyingId(productId);
    setMessage("");
    setError(false);

    try {
      const response = await fetch(
        `${API_URL}/purchase/${productId}`,
        { method: "POST" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Purchase failed");
      }

      setMessage("Purchase successful!");
      await fetchProducts();
    } catch (err) {
      setMessage(err.message || "Purchase failed");
      setError(true);
      await fetchProducts();
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div>
          <p className="eyebrow">INVENTORY MANAGEMENT</p>
          <h1>Product Store</h1>
          <p className="subtitle">
            Browse products and purchase while stock lasts.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchProducts}
          disabled={loading}
        >
          Refresh
        </button>
      </header>

      {message && (
        <div
          className={`message ${error ? "error" : "success"}`}
          role="status"
        >
          {message}
        </div>
      )}

      <section className="products-section">
        <div className="section-heading">
          <h2>Available products</h2>
          <span>{products.length} products</span>
        </div>

        {loading ? (
          <p className="empty-state">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="empty-state">
            No products found. Add a product through the admin API.
          </p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product._id}>
                <div className="product-icon" aria-hidden="true">
                  {product.name.charAt(0).toUpperCase()}
                </div>

                <h3>{product.name}</h3>

                <p className="price">
                  Rs. {Number(product.price).toLocaleString("en-PK")}
                </p>

                <p className="stock">
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </p>

                <button
                  className="buy-button"
                  onClick={() => handlePurchase(product._id)}
                  disabled={product.stock <= 0 || buyingId !== null}
                >
                  {buyingId === product._id
                    ? "Processing..."
                    : product.stock <= 0
                    ? "Out of stock"
                    : "Buy one"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
