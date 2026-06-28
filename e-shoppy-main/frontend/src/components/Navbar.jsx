import React from 'react';

export default function Navbar({ activeTab, setActiveTab, cart }) {
  const totalItems = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <header>
      <div className="logo" onClick={() => setActiveTab('home')}>
        <img src="images/logo.png" alt="Eshoppy Logo" />
        <span className="logo-text">Eshoppy</span>
      </div>
      <nav>
        <a 
          href="#home" 
          className={activeTab === 'home' ? 'active-nav' : ''} 
          onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}
        >
          Home
        </a>
        <a 
          href="#products" 
          className={activeTab === 'products' ? 'active-nav' : ''} 
          onClick={(e) => { e.preventDefault(); setActiveTab('products'); }}
        >
          Products
        </a>
        <a 
          href="#cart" 
          className={`cart-nav-item ${activeTab === 'cart' ? 'active-nav' : ''}`} 
          onClick={(e) => { e.preventDefault(); setActiveTab('cart'); }}
        >
          Cart
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </a>
        <a 
          href="#contact" 
          className={activeTab === 'contact' ? 'active-nav' : ''} 
          onClick={(e) => { e.preventDefault(); setActiveTab('contact'); }}
        >
          Contact
        </a>
        <a 
          href="#admin" 
          className={activeTab === 'admin' ? 'active-nav' : ''} 
          onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }}
        >
          Admin
        </a>
      </nav>
    </header>
  );
}
