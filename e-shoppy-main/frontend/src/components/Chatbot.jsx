import React, { useState, useEffect, useRef } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: "Hi there! 🤖 I'm your Eshoppy Assistant. Feel free to search gadgets by name, category, or ask about ordering!"
        }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (customText = null) => {
    const text = customText !== null ? customText.trim() : inputVal.trim();
    if (!text) return;

    // Append user message
    const userMsg = {
      id: Date.now() + '-user',
      sender: 'user',
      text
    };
    setMessages(prev => [...prev, userMsg]);
    if (customText === null) setInputVal('');
    
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) throw new Error('Chatbot connection failed');
      const data = await response.json();
      
      const botMsg = {
        id: Date.now() + '-bot',
        sender: 'bot',
        text: data.reply
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot query error:", err);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + '-error',
          sender: 'bot',
          text: "Sorry, I'm having trouble connecting to the server. Please check if the backend is running!"
        }
      ]);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const formatText = (text) => {
    // Escape HTML tags to prevent XSS
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
      
    // Format simple markdown bold tags **text** into <strong>text</strong>
    const formatted = escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const quickReplies = [
    { label: '📱 Mobiles', query: 'Quantum' },
    { label: '🎧 Audio', query: 'AeroFlow' },
    { label: '⌚ Wearables', query: 'Horizon' },
    { label: '💰 Check Prices', query: 'prices' },
    { label: '🛍️ How to order?', query: 'how to order' }
  ];

  return (
    <div id="chatbot">
      {isOpen && (
        <div id="chat-body" style={{ display: 'flex' }}>
          <div id="chat-messages">
            {messages.map(msg => (
              <div className={`chat-msg ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`} key={msg.id}>
                <div className="msg-bubble">{formatText(msg.text)}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg bot-msg typing-msg">
                <div className="msg-bubble typing-bubble">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies Panel */}
          <div className="chat-quick-replies">
            {quickReplies.map((qr, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => handleSend(qr.query)}
              >
                {qr.label}
              </button>
            ))}
          </div>

          <div className="chat-input-container">
            <input 
              type="text" 
              id="chat-input" 
              placeholder="Type a message..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyPress={handleKey}
            />
            <button className="send-chat-btn" onClick={() => handleSend()} style={{ border: 'none' }}>Send</button>
          </div>
        </div>
      )}
      <div id="chat-header" onClick={handleToggle}>
        <span>💬</span> Eshoppy AI Chat
      </div>
    </div>
  );
}
