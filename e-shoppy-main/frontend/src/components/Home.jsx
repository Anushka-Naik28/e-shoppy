import React, { useEffect, useState } from 'react';

export default function Home({ onShopNow }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        // Sort by rating descending and pick top 3
        const sorted = [...data].sort((a, b) => b.rating - a.rating).slice(0, 3);
        setFeaturedProducts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load featured products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Elevate Your Digital Lifestyle</h1>
          <p>
            Explore our handpicked collection of ultra-premium smart gadgets and tech accessories
            designed to merge high-performance capabilities with stunning modern aesthetics.
          </p>
          <button onClick={onShopNow} className="btn-primary">
            Shop the Collection ⚡
          </button>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="featured-section">
        <h2 className="section-title">Featured Curations</h2>
        {loading ? (
          <div style={{ textAlignment: 'center', padding: '20px', color: '#94a3b8' }}>Loading top-rated gear...</div>
        ) : (
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-card-img-container">
                  <img src={product.image} alt={product.name} />
                  <span className="product-tag">{product.category}</span>
                </div>
                <div className="product-card-info">
                  <div className="product-rating-row">
                    <span>★ {product.rating.toFixed(1)}</span>
                    <span className="reviews-txt">({product.reviewsCount} reviews)</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p className="product-card-desc">{product.description}</p>
                  <div className="product-footer-row">
                    <span className="product-price-lbl">${product.price}</span>
                    <button onClick={onShopNow} className="btn-primary product-card-btn">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Benefits Grid */}
      <section className="benefits-section">
        <h2 className="section-title">Why Shop With Us?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <span className="benefit-icon">⚡</span>
            <h3>Express Shipping</h3>
            <p>Free, carbon-neutral delivery on all orders over $75 with automated real-time tracking.</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">🤖</span>
            <h3>AI-Guided Shopping</h3>
            <p>Get personalized product suggestions and checkout guidance from our interactive chatbot assistant.</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">🔒</span>
            <h3>Secure Payments</h3>
            <p>All transactions are guarded by 256-bit SSL encryption and modern fraud protection systems.</p>
          </div>
          <div className="benefit-card">
            <span className="benefit-icon">🔄</span>
            <h3>Premium Warranty</h3>
            <p>No-questions-asked 30-day money-back guarantee and 1-year product replacement warranty.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
