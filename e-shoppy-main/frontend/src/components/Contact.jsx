import React, { useState } from 'react';

export default function Contact({ showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Failed to send message');

      showToast("Message sent successfully! ✉️");
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error("Submit contact form error:", err);
      alert(`Could not send message: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <h2>Get in Touch</h2>
      <p className="contact-subtitle">We'd love to hear from you. Drop us a line and our AI response team will get back to you shortly.</p>
      
      <div className="contact-grid">
        {/* Contact details card */}
        <div className="contact-card info-card">
          <h3>Contact Information</h3>
          <p>Feel free to reach out via email, phone, or stop by our office in the tech hub.</p>
          
          <div className="info-items">
            <div className="info-item">
              <span className="icon">✉️</span>
              <div>
                <h4>Email Us</h4>
                <p><a href="mailto:support@eshoppy.com">support@eshoppy.com</a></p>
              </div>
            </div>
            
            <div className="info-item">
              <span className="icon">📞</span>
              <div>
                <h4>Call Us</h4>
                <p><a href="tel:+919876543210">+91 9876543210</a></p>
              </div>
            </div>
            
            <div className="info-item">
              <span className="icon">📍</span>
              <div>
                <h4>Visit Us</h4>
                <p>123 Tech Street, Indiranagar,<br />Bengaluru, Karnataka, 560038</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="contact-card form-card">
          <h3>Send us a Message</h3>
          <form id="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name">Name *</label>
              <input 
                type="text" 
                id="contact-name" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-email">Email Address *</label>
              <input 
                type="email" 
                id="contact-email" 
                placeholder="john@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input 
                type="text" 
                id="contact-subject" 
                placeholder="Question about Smartphone..." 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-message">Message *</label>
              <textarea 
                id="contact-message" 
                rows="5" 
                placeholder="Write your message here..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary submit-btn" 
              style={{ border: 'none' }}
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
