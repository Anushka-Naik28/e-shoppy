import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [dashboardData, setDashboardData] = useState({ orders: [], messages: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Administrative Navigation Tab
  const [adminTab, setAdminTab] = useState('overview');

  // Form state for creating products
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCat, setNewProdCat] = useState('mobile');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdFeatures, setNewProdFeatures] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdImage, setNewProdImage] = useState('images/product2.jpg');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchDashboardData = () => {
    fetch(`${API_URL}/api/admin/data`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dashboard statistics');
        return res.json();
      })
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch dashboard error:", err);
        setError("Could not retrieve dashboard statistics. Ensure the backend is active.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, [API_URL]);

  // Order status modification
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to update order');
      fetchDashboardData(); // Reload stats
    } catch (err) {
      alert(`Error updating order: ${err.message}`);
    }
  };

  // Order deletion
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete Order ${orderId}?`)) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error('Failed to delete order');
      fetchDashboardData(); // Reload stats
    } catch (err) {
      alert(`Error deleting order: ${err.message}`);
    }
  };

  // Inquiry message deletion
  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Delete this customer inquiry?')) return;
    try {
      const response = await fetch(`${API_URL}/api/admin/messages/${msgId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error('Failed to delete message');
      fetchDashboardData(); // Reload stats
    } catch (err) {
      alert(`Error deleting message: ${err.message}`);
    }
  };

  // Inventory: Add product
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      alert('Product Name and Price are required.');
      return;
    }

    setFormSubmitting(true);

    // Split features by commas or newlines into array of strings
    const featuresList = newProdFeatures
      ? newProdFeatures.split(/[,\n]/).map(f => f.trim()).filter(Boolean)
      : [];

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          price: Number(newProdPrice),
          category: newProdCat,
          description: newProdDesc,
          features: featuresList,
          stock: Number(newProdStock),
          image: newProdImage
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to add product');
      
      // Reset form states
      setNewProdName('');
      setNewProdPrice('');
      setNewProdDesc('');
      setNewProdFeatures('');
      setNewProdStock('10');
      
      fetchDashboardData(); // Reload stats
      alert('New product successfully registered to the catalog!');
    } catch (err) {
      alert(`Error registering product: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Inventory: Delete product
  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm(`Delete product "${prodId}" from catalog?`)) return;
    try {
      const response = await fetch(`${API_URL}/api/products/${prodId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error('Failed to delete product');
      fetchDashboardData(); // Reload stats
    } catch (err) {
      alert(`Error deleting product: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <main className="admin-container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Loading Executive Dashboard...</h2>
        <div style={{ marginTop: '20px', color: '#94a3b8' }}>Gathering system information and orders logs</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2 style={{ color: '#ef4444' }}>Connection Interrupted</h2>
        <div className="error-msg" style={{ padding: '40px', color: '#ef4444', fontWeight: 'bold' }}>{error}</div>
      </main>
    );
  }

  const { orders = [], messages = [], products = [] } = dashboardData;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <main className="admin-container">
      {/* Header Info */}
      <div className="admin-header-block">
        <div>
          <h2>Executive Management Portal</h2>
          <p>Real-time shop statistics, inventory logs, order fulfillments, and client inquiries.</p>
        </div>
      </div>

      {/* Tabs Selector Navigation */}
      <div className="admin-tabs-nav">
        <button 
          onClick={() => setAdminTab('overview')} 
          className={`admin-tab-btn ${adminTab === 'overview' ? 'active' : ''}`}
        >
          📊 Stats Overview
        </button>
        <button 
          onClick={() => setAdminTab('orders')} 
          className={`admin-tab-btn ${adminTab === 'orders' ? 'active' : ''}`}
        >
          📦 Orders ({orders.length})
        </button>
        <button 
          onClick={() => setAdminTab('messages')} 
          className={`admin-tab-btn ${adminTab === 'messages' ? 'active' : ''}`}
        >
          ✉️ Enquiries ({messages.length})
        </button>
        <button 
          onClick={() => setAdminTab('inventory')} 
          className={`admin-tab-btn ${adminTab === 'inventory' ? 'active' : ''}`}
        >
          ⚙️ Manage Inventory ({products.length})
        </button>
      </div>

      {/* STATS OVERVIEW TAB */}
      {adminTab === 'overview' && (
        <>
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-details">
                <h3 id="stat-revenue">${totalRevenue.toFixed(2)}</h3>
                <p>Gross Store Revenue</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-details">
                <h3 id="stat-orders">{orders.length}</h3>
                <p>Total Orders Placed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✉️</div>
              <div className="stat-details">
                <h3 id="stat-messages">{messages.length}</h3>
                <p>Client Inquiries</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚙️</div>
              <div className="stat-details">
                <h3>{products.length}</h3>
                <p>Catalogued Products</p>
              </div>
            </div>
          </section>

          {/* Quick summaries cards */}
          <div className="admin-content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div className="admin-card">
              <div className="card-header">
                <h3>Pending Orders</h3>
              </div>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.status === 'Pending').length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8' }}>No pending orders needing approval!</td>
                      </tr>
                    ) : (
                      orders.filter(o => o.status === 'Pending').map(order => (
                        <tr key={order.id}>
                          <td><span className="order-id-txt">{order.id}</span></td>
                          <td>{order.customerName}</td>
                          <td><strong>${order.total.toFixed(2)}</strong></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-card">
              <div className="card-header">
                <h3>Inventory Stock Alert</h3>
              </div>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Stock Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p => p.stock <= 5).length === 0 ? (
                      <tr>
                        <td colSpan="2" style={{ textAlign: 'center', color: '#10b981' }}>✓ All catalogued gear healthy in stock.</td>
                      </tr>
                    ) : (
                      products.filter(p => p.stock <= 5).map(prod => (
                        <tr key={prod.id}>
                          <td>{prod.name}</td>
                          <td>
                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                              CRITICAL STOCK: Only {prod.stock} left
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ORDERS TAB */}
      {adminTab === 'orders' && (
        <div className="admin-card">
          <div className="card-header">
            <h3>Registered Customer Orders</h3>
            <span className="badge">{orders.length} Logged Transactions</span>
          </div>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Information</th>
                  <th>Purchased Gadgets</th>
                  <th>Payment details</th>
                  <th>Status Workflow</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8' }}>No transactions recorded on this backend database.</td>
                  </tr>
                ) : (
                  [...orders].reverse().map((order) => {
                    const date = new Date(order.timestamp).toLocaleString();
                    const itemsText = order.items.map(i => `${i.name} (x${i.quantity})`).join(', ');
                    return (
                      <tr key={order.id}>
                        <td>
                          <span className="order-id-txt">{order.id}</span>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{date}</div>
                        </td>
                        <td>
                          <strong>{order.customerName}</strong>
                          <div className="customer-detail-block">
                            <div>✉️ {order.customerEmail}</div>
                            <div>📞 {order.customerPhone}</div>
                            <div>📍 {order.shippingAddress}</div>
                          </div>
                        </td>
                        <td style={{ maxWidth: '220px', fontSize: '13px' }}>{itemsText}</td>
                        <td>
                          <strong>${order.total.toFixed(2)}</strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{order.paymentMethod}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="status-select"
                              aria-label="Change order status"
                            >
                              <option value="Pending">Set: Pending</option>
                              <option value="Shipped">Set: Shipped</option>
                              <option value="Delivered">Set: Delivered</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <button 
                            onClick={() => handleDeleteOrder(order.id)} 
                            className="btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOMER MESSAGES TAB */}
      {adminTab === 'messages' && (
        <div className="admin-card">
          <div className="card-header">
            <h3>Customer Service Inbox</h3>
            <span className="badge">{messages.length} Submissions</span>
          </div>
          <div className="messages-feed">
            {messages.length === 0 ? (
              <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                Customer inbox is completely clear! No inquiries pending.
              </div>
            ) : (
              [...messages].reverse().map((msg) => (
                <div className="message-feed-card" key={msg.id}>
                  <div className="msg-card-header">
                    <div>
                      <h4>{msg.name}</h4>
                      <a href={`mailto:${msg.email}`} className="msg-email-link">{msg.email}</a>
                    </div>
                    <span className="msg-date">{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="msg-subject"><strong>Subj:</strong> {msg.subject}</div>
                  <p className="msg-body">{msg.message}</p>
                  <button 
                    onClick={() => handleDeleteMessage(msg.id)} 
                    className="btn-danger" 
                    style={{ alignSelf: 'flex-end', marginTop: 'auto' }}
                  >
                    Delete Thread
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MANAGE INVENTORY TAB (CRUD) */}
      {adminTab === 'inventory' && (
        <div className="inventory-grid">
          {/* Add Product Form */}
          <div className="admin-form-card">
            <h3>Add Product to Catalog</h3>
            <form onSubmit={handleAddProductSubmit}>
              <div className="form-group">
                <label htmlFor="prod-name">Product Name *</label>
                <input 
                  type="text" 
                  id="prod-name"
                  required
                  placeholder="Quantum Phone X"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label htmlFor="prod-price">Price ($) *</label>
                  <input 
                    type="number" 
                    id="prod-price"
                    required
                    min="1"
                    placeholder="799"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prod-stock">Initial Stock *</label>
                  <input 
                    type="number" 
                    id="prod-stock"
                    required
                    min="1"
                    placeholder="10"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prod-category">Category</label>
                <select 
                  id="prod-category"
                  value={newProdCat}
                  onChange={(e) => setNewProdCat(e.target.value)}
                >
                  <option value="mobile">Mobiles</option>
                  <option value="audio">Audio / Headphones</option>
                  <option value="wearables">Wearables / Smartwatches</option>
                  <option value="smarthome">Smart Home / IoT</option>
                  <option value="other">Other Accessories</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="prod-image">Product Image Template</label>
                <select
                  id="prod-image"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                >
                  <option value="images/product1.jpg">Smartphone Mock (Product 1)</option>
                  <option value="images/product2.jpg">Headphones Mock (Product 2)</option>
                  <option value="images/product3.jpg">Smartwatch Mock (Product 3)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="prod-desc">Brief Description *</label>
                <textarea 
                  id="prod-desc"
                  required
                  rows="3"
                  placeholder="Summarize product features..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="prod-features">Key Specs (separated by commas or newlines)</label>
                <textarea 
                  id="prod-features"
                  rows="3"
                  placeholder="e.g. OLED Display, 5G Connectivity, 20 Hours Playback"
                  value={newProdFeatures}
                  onChange={(e) => setNewProdFeatures(e.target.value)}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={formSubmitting} 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '10px' }}
              >
                {formSubmitting ? 'Registering...' : 'Add Product to Shop Catalog'}
              </button>
            </form>
          </div>

          {/* Current Products Catalog */}
          <div className="admin-card" style={{ flexGrow: 1 }}>
            <div className="card-header">
              <h3>Active Store Catalog</h3>
              <span className="badge">{products.length} Items Listed</span>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <strong>{prod.name}</strong>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>ID: {prod.id}</div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.03)', color: '#ffffff', textTransform: 'uppercase' }}>
                          {prod.category}
                        </span>
                      </td>
                      <td><strong>${prod.price}</strong></td>
                      <td>
                        <span style={{ color: prod.stock <= 5 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                          {prod.stock} items
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDeleteProduct(prod.id)} 
                          className="btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
