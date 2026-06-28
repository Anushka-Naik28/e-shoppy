import React, { useEffect, useState } from 'react';

export default function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('default');

  // Detail Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch products error:", err);
        setError("Could not load products. Please check if backend is running.");
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) {
    return (
      <div className="products-layout" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Loading Catalog...</h2>
        <div style={{ marginTop: '20px', color: '#94a3b8' }}>Fetching premium tech gear from the server</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-layout" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2 style={{ color: '#ef4444' }}>Offline Mode</h2>
        <p style={{ marginTop: '20px', color: '#94a3b8' }}>{error}</p>
      </div>
    );
  }

  // Filter and Sort execution
  const filteredProducts = products
    .filter((product) => {
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'rating-desc') return b.rating - a.rating;
      return 0;
    });

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'mobile', label: 'Mobiles' },
    { id: 'audio', label: 'Audio' },
    { id: 'wearables', label: 'Wearables' },
    { id: 'smarthome', label: 'Smart Home' }
  ];

  return (
    <section className="products-layout">
      <h2 className="section-title">Our Premium Catalog</h2>
      
      {/* Filtering and Search Controls */}
      <div className="products-filter-bar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search gadgets, specs, features..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="categories-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="sort-wrapper">
          <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: Highest First</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <h3>No products match your search criteria.</h3>
          <p style={{ marginTop: '10px' }}>Try typing another search word or resetting filters.</p>
        </div>
      ) : (
        <div className="products-grid" id="product-grid">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <div 
                className="product-card-img-container" 
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.image} alt={product.name} />
                <span className="product-tag">{product.category}</span>
              </div>
              <div className="product-card-info">
                <div className="product-rating-row">
                  <span>★ {product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                  <span className="reviews-txt">({product.reviewsCount || 10} reviews)</span>
                </div>
                <h3 onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
                  {product.name}
                </h3>
                <p className="product-card-desc">{product.description}</p>
                <div className="product-footer-row">
                  <span className="product-price-lbl">${product.price}</span>
                  <button 
                    onClick={() => addToCart(product)} 
                    className="btn-primary product-card-btn"
                  >
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal" style={{ display: 'flex' }} onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Product Specifications</h2>
              <span className="close-btn" onClick={() => setSelectedProduct(null)}>&times;</span>
            </div>
            <div className="modal-body">
              <div className="product-detail-layout">
                <div className="detail-img-box">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div className="detail-content-box">
                  <span className="product-tag" style={{ position: 'static', display: 'inline-block', marginBottom: '10px' }}>
                    {selectedProduct.category}
                  </span>
                  <h2>{selectedProduct.name}</h2>
                  <div className="product-rating-row" style={{ margin: '10px 0 15px' }}>
                    <span>★ {selectedProduct.rating.toFixed(1)}</span>
                    <span className="reviews-txt">({selectedProduct.reviewsCount} verified reviews)</span>
                  </div>
                  <div className="detail-price-line">${selectedProduct.price}</div>
                  
                  <span className={`detail-stock-badge ${selectedProduct.stock <= 3 ? 'low-stock' : 'in-stock'}`}>
                    {selectedProduct.stock <= 3 ? `⚠️ Low Stock: Only ${selectedProduct.stock} left` : '✓ In Stock & Ready to Ship'}
                  </span>

                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                    {selectedProduct.description}
                  </p>

                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Key Specifications:</h4>
                  <ul className="detail-features-list">
                    {selectedProduct.features && selectedProduct.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mock reviews */}
              <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                <h4 style={{ marginBottom: '15px' }}>Customer Reviews</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                      <strong>Alex Johnson</strong>
                      <span style={{ color: '#fbbf24' }}>★★★★★</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#f1f5f9' }}>"Absolutely outstanding quality. Exceeded my expectations, fast delivery too!"</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                      <strong>Sarah Kelly</strong>
                      <span style={{ color: '#fbbf24' }}>★★★★☆</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#f1f5f9' }}>"Great product for daily use. Sleek, premium build, battery holds up very well."</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setSelectedProduct(null)}
              >
                Close Details
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                Add to Cart 🛒
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
