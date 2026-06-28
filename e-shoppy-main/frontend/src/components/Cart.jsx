import React, { useState } from 'react';

export default function Cart({ cart, updateQuantity, removeFromCart, clearCart, showToast, setActiveTab }) {
  // Wizard steps: 'cart' or 'checkout'
  const [step, setStep] = useState('cart');

  // Customer Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Order result state for modal
  const [orderResult, setOrderResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalSum = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isEmpty = cart.length === 0;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!name || !email || !address) {
      alert("Please fill out the required shipping details.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart,
          total: totalSum,
          customerName: name,
          customerEmail: email,
          customerPhone: phone || 'N/A',
          shippingAddress: address,
          paymentMethod: paymentMethod
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Simulated checkout failed');
      }

      setOrderResult(result.order);
      setShowModal(true);
      clearCart();
      showToast("Order placed successfully! 🎉");
      setStep('cart'); // Reset step for next shopping
    } catch (err) {
      console.error("Simulated checkout error:", err);
      alert(`Checkout failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOrderResult(null);
    setActiveTab('products');
  };

  return (
    <>
      <section className="cart-section">
        {/* Step Indicators */}
        <div className="cart-steps-header">
          <span className={`step-indicator ${step === 'cart' ? 'active' : ''}`}>
            <span>1</span> Review Cart
          </span>
          <span className="step-divider"></span>
          <span className={`step-indicator ${step === 'checkout' ? 'active' : ''}`}>
            <span>2</span> Shipping & Checkout
          </span>
        </div>

        {isEmpty && !showModal ? (
          <div className="empty-cart-message">
            <p>Your shopping cart is empty!</p>
            <button onClick={() => setActiveTab('products')} className="btn-primary">
              Browse Products Catalog
            </button>
          </div>
        ) : (
          <div className="cart-container">
            {/* Step 1: Cart Items List */}
            {step === 'cart' && (
              <div className="cart-items-wrapper">
                <h3>Shopping Cart List ({cart.reduce((s, i) => s + i.quantity, 0)} Items)</h3>
                <div id="cart-list">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-img">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-item-details">
                        <h4>{item.name}</h4>
                        <p className="cart-item-price">${item.price}</p>
                      </div>
                      <div className="cart-item-qty">
                        <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn" aria-label="Decrease quantity">-</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn" aria-label="Increase quantity">+</button>
                      </div>
                      <div className="cart-item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="remove-btn" title="Remove Item">&times;</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Shipping Form */}
            {step === 'checkout' && (
              <div className="checkout-form-wrapper">
                <h3>Secure Shipping Details</h3>
                <form id="contact-form" onSubmit={handleCheckoutSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="customer-name">Full Name *</label>
                      <input
                        type="text"
                        id="customer-name"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="customer-email">Email Address *</label>
                      <input
                        type="email"
                        id="customer-email"
                        required
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="customer-phone">Phone Number</label>
                      <input
                        type="tel"
                        id="customer-phone"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="customer-payment">Payment Method</label>
                      <select
                        id="customer-payment"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Credit Card">Credit / Debit Card</option>
                        <option value="PayPal">PayPal Secure</option>
                        <option value="UPI">UPI Payment</option>
                        <option value="Net Banking">Net Banking</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="customer-address">Complete Shipping Address *</label>
                      <textarea
                        id="customer-address"
                        required
                        rows="3"
                        placeholder="Flat No, Street Address, City, State, ZIP Code"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button type="button" onClick={() => setStep('cart')} className="btn-secondary" style={{ flex: 1 }}>
                      Back to Cart
                    </button>
                    <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1.5 }}>
                      {submitting ? 'Processing Payment...' : 'Secure Checkout & Place Order 🔒'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Cart Summary Side Panel */}
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>${totalSum.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping & Handling</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>FREE</span>
              </div>
              <div className="summary-row">
                <span>Estimated Tax (GST)</span>
                <span>$0.00</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Cost</span>
                <span>${totalSum.toFixed(2)}</span>
              </div>

              {step === 'cart' && (
                <button onClick={() => setStep('checkout')} className="btn-primary checkout-btn">
                  Proceed to Checkout
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Confirmation Modal / Styled Invoice */}
      {showModal && orderResult && (
        <div id="order-modal" className="modal" style={{ display: 'flex' }} onClick={handleCloseModal}>
          <div className="modal-content narrow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Invoice Recieved! 🎉</h2>
              <span className="close-btn" onClick={handleCloseModal}>&times;</span>
            </div>
            <div className="modal-body" id="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '48px' }}>💳</span>
                <h3 style={{ marginTop: '10px' }}>Payment Confirmed</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>Thank you for buying from Eshoppy.</p>
              </div>

              <div className="order-success-details">
                <p><strong>Order ID:</strong> <span className="order-id-badge">{orderResult.id}</span></p>
                <p><strong>Date & Time:</strong> {new Date(orderResult.timestamp).toLocaleString()}</p>
                <p><strong>Billing Name:</strong> {orderResult.customerName}</p>
                <p><strong>Shipping To:</strong> {orderResult.shippingAddress}</p>
                <p><strong>Method Selected:</strong> {orderResult.paymentMethod}</p>
                
                <div className="receipt-divider"></div>
                
                <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Ordered Gadgets:</h4>
                <ul className="receipt-items-list">
                  {orderResult.items.map((item, idx) => (
                    <li key={idx}>
                      <span>{item.name} &times; {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <div className="receipt-divider"></div>
                
                <p style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#ffffff' }}>
                  <span>Total Amount Billed</span>
                  <span>${orderResult.total.toFixed(2)}</span>
                </p>

                <p className="delivery-status-note">🚀 Standard delivery expected in 2-3 business days.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal} className="btn-primary" style={{ width: '100%' }}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
