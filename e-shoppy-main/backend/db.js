const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const MESSAGES_FILE = path.join(__dirname, 'data', 'messages.json');

// Helper to safely read JSON file
function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

// Helper to safely write JSON file
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
}
module.exports = {
  getProducts: () => {
    return readJSON(PRODUCTS_FILE);
  },

  addProduct: (product) => {
    const products = readJSON(PRODUCTS_FILE);
    
    // Generate clean ID from name
    const generatedId = product.name
      ? product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      : 'prod-' + Math.floor(100000 + Math.random() * 900000);
      
    const newProduct = {
      id: product.id || generatedId,
      name: product.name || 'New Product',
      price: Number(product.price) || 0,
      image: product.image || 'images/product2.jpg',
      category: product.category || 'other',
      description: product.description || '',
      features: Array.isArray(product.features) ? product.features : [],
      rating: Number(product.rating) || 5.0,
      reviewsCount: Number(product.reviewsCount) || 1,
      stock: Number(product.stock) || 10,
      ...product
    };

    products.push(newProduct);
    writeJSON(PRODUCTS_FILE, products);
    return newProduct;
  },

  deleteProduct: (id) => {
    const products = readJSON(PRODUCTS_FILE);
    const filtered = products.filter(p => p.id !== id);
    writeJSON(PRODUCTS_FILE, filtered);
    return true;
  },

  getOrders: () => {
    return readJSON(ORDERS_FILE);
  },

  addOrder: (order) => {
    const orders = readJSON(ORDERS_FILE);
    
    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      status: 'Pending',
      ...order
    };
    
    orders.push(newOrder);
    writeJSON(ORDERS_FILE, orders);
    return newOrder;
  },

  updateOrderStatus: (id, status) => {
    const orders = readJSON(ORDERS_FILE);
    const idx = orders.findIndex(o => o.id === id);
    if (idx > -1) {
      orders[idx].status = status;
      writeJSON(ORDERS_FILE, orders);
      return orders[idx];
    }
    return null;
  },

  deleteOrder: (id) => {
    const orders = readJSON(ORDERS_FILE);
    const filtered = orders.filter(o => o.id !== id);
    writeJSON(ORDERS_FILE, filtered);
    return true;
  },

  getMessages: () => {
    return readJSON(MESSAGES_FILE);
  },

  addMessage: (message) => {
    const messages = readJSON(MESSAGES_FILE);
    
    const newMessage = {
      id: 'MSG-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      ...message
    };
    
    messages.push(newMessage);
    writeJSON(MESSAGES_FILE, messages);
    return newMessage;
  },

  deleteMessage: (id) => {
    const messages = readJSON(MESSAGES_FILE);
    const filtered = messages.filter(m => m.id !== id);
    writeJSON(MESSAGES_FILE, filtered);
    return true;
  }
};
