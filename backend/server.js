const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data structures
const users = [];
const products = [];
const orders = [];
const returns = [];

const SECRET_KEY = 'secret_key_prototype';

// Setup multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  }
};

// Routes

// --- Auth Routes ---
app.post('/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { 
    id: Date.now().toString(), 
    name, 
    email, 
    password: hashedPassword, 
    role: role || 'user',
    trustScore: 90, // default high trust
    returnCount: 0 
  };
  users.push(newUser);
  res.status(201).json({ message: 'User created' });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'User not found' });
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Invalid password' });
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, SECRET_KEY);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, trustScore: user.trustScore, returnCount: user.returnCount } });
});

// --- Product Routes ---
app.get('/products', (req, res) => {
  res.json(products);
});

app.post('/products', authenticateToken, checkRole('seller'), (req, res) => {
  const { name, price, description, imageUrl } = req.body;
  const newProduct = {
    id: Date.now().toString(),
    sellerId: req.user.id,
    name,
    price,
    description,
    imageUrl: imageUrl || 'https://via.placeholder.com/150'
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// --- Order Routes ---
app.post('/orders', authenticateToken, (req, res) => {
  const { items, totalAmount } = req.body; // items: [{productId, quantity, price, name}]
  const newOrder = {
    id: Date.now().toString(),
    userId: req.user.id,
    items,
    totalAmount,
    date: new Date(),
    status: 'Delivered' // default to delivered for return prototype
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.get('/orders/user/:id', authenticateToken, (req, res) => {
  if (req.user.id !== req.params.id) return res.sendStatus(403);
  const userOrders = orders.filter(o => o.userId === req.params.id);
  res.json(userOrders);
});

// --- Return Routes ---
app.post('/returns/request', authenticateToken, upload.single('proofImage'), (req, res) => {
  const { orderId, productId, reason } = req.body;
  
  const order = orders.find(o => o.id === orderId);
  if (!order || order.userId !== req.user.id) {
    return res.status(400).json({ message: 'Invalid order' });
  }

  const user = users.find(u => u.id === req.user.id);
  const product = products.find(p => p.id === productId);
  
  user.returnCount = (user.returnCount || 0) + 1;
  
  // Smart Refund Decision Engine
  let fraudFlag = 'Verified';
  if (user.returnCount > 5) {
    fraudFlag = 'Risky';
    user.trustScore = Math.max(0, user.trustScore - 20); // penalize
  }

  let autoStatus = 'Requested';
  if (fraudFlag !== 'Risky') {
    if (user.trustScore > 80 || (product && product.price < 50)) {
      autoStatus = 'Approved';
    }
  }

  const newReturn = {
    id: Date.now().toString(),
    userId: req.user.id,
    orderId,
    productId,
    reason,
    proofImage: req.file ? `/uploads/${req.file.filename}` : null,
    status: autoStatus,
    fraudFlag,
    date: new Date()
  };
  returns.push(newReturn);
  res.status(201).json(newReturn);
});

// Instant Refund Route
app.post('/returns/instant-refund', authenticateToken, (req, res) => {
  const { returnId } = req.body;
  const returnReq = returns.find(r => r.id === returnId);
  if (!returnReq || returnReq.userId !== req.user.id) return res.status(404).json({ message: 'Return not found' });
  
  const user = users.find(u => u.id === req.user.id);
  if (user.trustScore >= 90) {
    returnReq.status = 'Refunded';
    res.json(returnReq);
  } else {
    res.status(403).json({ message: 'Not eligible for instant refund' });
  }
});

// AI Mock Endpoint
app.post('/api/ai-validate', authenticateToken, upload.single('image'), (req, res) => {
  setTimeout(() => {
    res.json({ status: "verified", confidence: Math.floor(Math.random() * 15) + 85 });
  }, 1500); // simulated AI delay
});

// Demo Setup Endpoint
app.post('/demo/run', authenticateToken, (req, res) => {
  const product = { id: 'demo-prod-' + Date.now(), sellerId: 'demo-seller', name: 'Demo Smart Headphones', price: 299, description: 'Noise cancelling headphones', imageUrl: 'https://via.placeholder.com/300' };
  products.push(product);
  const order = { id: 'DEMO-' + Date.now(), userId: req.user.id, items: [{productId: product.id, name: product.name, price: product.price, quantity: 1}], totalAmount: 299, date: new Date(), status: 'Delivered' };
  orders.push(order);
  const returnReq = { id: 'RET-' + Date.now(), userId: req.user.id, orderId: order.id, productId: product.id, reason: 'Demo smart tracking test', status: 'Requested', fraudFlag: 'Verified', date: new Date(), proofImage: null };
  returns.push(returnReq);
  res.json({ success: true, returnReq });
});

app.get('/returns/user/:id', authenticateToken, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'seller') {
     return res.sendStatus(403);
  }
  let userReturns;
  if (req.user.role === 'seller') {
    // Return all returns for products owned by seller
    const sellerProductIds = products.filter(p => p.sellerId === req.user.id).map(p => p.id);
    userReturns = returns.filter(r => sellerProductIds.includes(r.productId));
  } else {
    userReturns = returns.filter(r => r.userId === req.params.id);
  }
  
  res.json(userReturns);
});

app.put('/returns/status/:id', authenticateToken, checkRole('seller'), (req, res) => {
  const { status } = req.body;
  const returnReq = returns.find(r => r.id === req.params.id);
  if (!returnReq) return res.status(404).json({ message: 'Return not found' });
  
  const product = products.find(p => p.id === returnReq.productId);
  if (!product || product.sellerId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized for this return' });
  }

  returnReq.status = status;
  res.json(returnReq);
});

const PORT = 5000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
