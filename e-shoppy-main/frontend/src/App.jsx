import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Chatbot from './components/Chatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [toastMessage, setToastMessage] = useState('');

  // Synchronize cart state to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Toast notification triggers
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === product.id);
      if (existingIdx > -1) {
        const newCart = [...prevCart];
        newCart[existingIdx].quantity += 1;
        showToast(`${product.name} added to cart! 🛒`);
        return newCart;
      } else {
        showToast(`${product.name} added to cart! 🛒`);
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
          }
        ];
      }
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((item) => item.id === productId);
      if (idx === -1) return prevCart;

      const newCart = [...prevCart];
      newCart[idx].quantity += delta;

      if (newCart[idx].quantity <= 0) {
        newCart.splice(idx, 1);
      }

      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId);
      if (item) {
        showToast(`${item.name} removed from cart`);
      }
      return prevCart.filter((i) => i.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Render view depending on active tab
  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <Home onShopNow={() => setActiveTab('products')} />;
      case 'products':
        return <Products addToCart={addToCart} />;
      case 'cart':
        return (
          <Cart 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            clearCart={clearCart} 
            showToast={showToast}
            setActiveTab={setActiveTab}
          />
        );
      case 'contact':
        return <Contact showToast={showToast} />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onShopNow={() => setActiveTab('products')} />;
    }
  };

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} cart={cart} />
      
      <main className="content-area">
        {renderView()}
      </main>

      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Eshoppy</h3>
            <p>Your one-stop destination for premium smart devices, wearables, and high-fidelity audio equipment.</p>
          </div>
          <div className="footer-col">
            <h3>Shop Categories</h3>
            <ul>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); setActiveTab('products'); }}>Mobiles</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); setActiveTab('products'); }}>Audio Devices</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); setActiveTab('products'); }}>Wearables</a></li>
              <li><a href="#products" onClick={(e) => { e.preventDefault(); setActiveTab('products'); }}>Smart Home</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>Home</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); setActiveTab('contact'); }}>Contact Support</a></li>
              <li><a href="#admin" onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}>Admin Dashboard</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Join Our Newsletter</h3>
            <p>Stay up to date with the latest gadgets releases and exclusive sales alerts.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" aria-label="Email address" />
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Eshoppy Inc. All rights reserved.</p>
          <div className="footer-links">
            <a href="#home" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#home" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          </div>
        </div>
      </footer>

      <Chatbot />

      {/* Floating Toast element */}
      <div id="toast" className={toastMessage ? 'show' : ''}>
        {toastMessage}
      </div>
    </div>
  );
}
