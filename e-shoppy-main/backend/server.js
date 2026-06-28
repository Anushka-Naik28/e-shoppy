const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// API: Get products
app.get('/api/products', (req, res) => {
  const products = db.getProducts();
  res.json(products);
});

// API: Add a product (Admin capability)
app.post('/api/products', (req, res) => {
  const { name, price, category, description, features, stock, image } = req.body;
  if (!name || !price) {
    return res.status(400).json({ success: false, error: 'Product name and price are required' });
  }

  const productData = {
    name,
    price: Number(price),
    category: category || 'other',
    description: description || '',
    features: Array.isArray(features) ? features : (features ? [features] : []),
    stock: Number(stock) || 10,
    image: image || 'images/product2.jpg'
  };

  const newProduct = db.addProduct(productData);
  res.status(201).json({ success: true, product: newProduct });
});

// API: Delete a product (Admin capability)
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.deleteProduct(id);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// API: Create an order (checkout)
app.post('/api/checkout', (req, res) => {
  const { items, total, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty or invalid' });
  }
  if (!customerName || !customerEmail || !shippingAddress) {
    return res.status(400).json({ success: false, error: 'Customer name, email, and shipping address are required' });
  }

  const orderData = {
    items,
    total: total || 0,
    customerName,
    customerEmail,
    customerPhone: customerPhone || 'N/A',
    shippingAddress,
    paymentMethod: paymentMethod || 'Credit Card',
    status: 'Pending'
  };

  const newOrder = db.addOrder(orderData);
  res.status(201).json({ success: true, order: newOrder });
});

// API: Submit a contact inquiry
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }

  const messageData = {
    name,
    email,
    subject: subject || 'General Inquiry',
    message
  };

  const newMessage = db.addMessage(messageData);
  res.status(201).json({ success: true, message: newMessage });
});

// API: Chatbot reply processor (dynamic search)
app.post('/api/chatbot', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "I didn't receive any message." });
  }

  const msg = message.toLowerCase().trim();
  const products = db.getProducts();

  let reply = "";

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    reply = "Hello! Welcome to Eshoppy 🤖. How can I help you find the perfect gadget today?";
  } else if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
    const list = products.slice(0, 5).map(p => `${p.name}: $${p.price}`).join(", ");
    reply = `Here are some of our pricing details: ${list}. Check out the **Products** tab to see our full catalog!`;
  } else if (msg.includes("buy") || msg.includes("cart") || msg.includes("order") || msg.includes("checkout")) {
    reply = "To buy items, add them to your cart on the **Products** page, then click 'Proceed to Checkout' inside the **Cart** page!";
  } else if (msg.includes("contact") || msg.includes("support") || msg.includes("help") || msg.includes("address") || msg.includes("email")) {
    reply = "You can contact our support team at **support@eshoppy.com**, call **+91 9876543210**, or fill out the form on our **Contact** page.";
  } else {
    // Try to match a product by name, description or category in our database
    const foundProduct = products.find(p => 
      msg.includes(p.name.toLowerCase()) || 
      msg.includes(p.id.toLowerCase()) || 
      msg.includes(p.category.toLowerCase()) ||
      p.name.toLowerCase().split(" ").some(word => word.length > 3 && msg.includes(word))
    );

    if (foundProduct) {
      reply = `The **${foundProduct.name}** belongs to the **${foundProduct.category}** category and is priced at **$${foundProduct.price}**. Description: ${foundProduct.description} ${foundProduct.stock <= 3 ? `⚠️ Only ${foundProduct.stock} left in stock!` : ""}`;
    } else {
      reply = "I'm not sure I understand that. Feel free to ask about our 'prices', how to 'order', 'contacting support', or search for a specific product name (e.g. 'Quantum', 'AeroFlow', 'Horizon')!";
    }
  }

  res.json({ reply });
});

// API: Admin panel statistics and lists
app.get('/api/admin/data', (req, res) => {
  const orders = db.getOrders();
  const messages = db.getMessages();
  const products = db.getProducts();

  res.json({
    orders,
    messages,
    products
  });
});

// API: Update order status (Admin capability)
app.put('/api/admin/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, error: 'Status is required' });
  }

  const updatedOrder = db.updateOrderStatus(id, status);
  if (!updatedOrder) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  res.json({ success: true, order: updatedOrder });
});

// API: Delete order (Admin capability)
app.delete('/api/admin/orders/:id', (req, res) => {
  const { id } = req.params;
  db.deleteOrder(id);
  res.json({ success: true, message: 'Order deleted successfully' });
});

// API: Delete customer inquiry message (Admin capability)
app.delete('/api/admin/messages/:id', (req, res) => {
  const { id } = req.params;
  db.deleteMessage(id);
  res.json({ success: true, message: 'Inquiry deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend Server is running at http://localhost:${PORT}`);
});
