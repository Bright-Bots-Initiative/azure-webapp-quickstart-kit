// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const bcrypt = require('bcryptjs');

// Import middleware
const authMiddleware = require('./middleware/auth');

// Initialize Express app
const app = express();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';
const PORT = process.env.PORT || 3000;

// Initialize lowdb
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

// Make db available to routes
app.locals.db = db;

// Function to initialize database if it's empty
const initializeDatabase = async () => {
  await db.read();
  db.data = db.data || { users: [], content: [] };
  // Add default content if none exists
  if (!db.data.content || db.data.content.length === 0) {
    db.data.content = [
      { id: '1', title: 'Sample Content 1', body: 'This is sample content.' },
      { id: '2', title: 'Sample Content 2', body: 'This is another sample content.' }
    ];
  }
  await db.write();
};

initializeDatabase().catch(err => console.error('Failed to initialize database:', err));

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' 
    ? 'https://your-app-url.azurewebsites.net' 
    : 'http://localhost:5173'),
  credentials: true
}));
app.use(bodyParser.json());

// API Routes

// Signup endpoint
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await db.read();
    // Check if user already exists
    const existingUser = db.data.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role
    };

    // Add to database
    db.data.users.push(newUser);
    await db.write();

    // Generate token for auto-login
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success with token
    res.status(201).json({
      message: 'User registered successfully',
      token, // Send token for auto-login
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    await db.read();
    // Find user
    const user = db.data.users.find(user => user.email === email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Protected routes

// User profile endpoint
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Exclude password from the returned user object
    const { password, ...profile } = user;
    res.json(profile);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile data' });
  }
});

// CRUD operations for content
// Create new content
app.post('/api/content', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const { title, body, category } = req.body;
    if (!title || !body) { // Basic validation
      return res.status(400).json({ error: 'Title and body are required' });
    }
    await db.read();
    const newContent = {
      id: Date.now().toString(), // Simple ID generation
      title,
      body,
      category: category || 'Uncategorized',
      createdAt: new Date().toISOString(),
      status: 'Draft' // Default status
    };
    db.data.content.push(newContent);
    await db.write();
    res.status(201).json(newContent);
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ message: 'Error creating content' });
  }
});

// Update existing content
app.put('/api/content/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const { id } = req.params;
    const { title, body, category, status } = req.body;
    await db.read();
    const contentIndex = db.data.content.findIndex(item => item.id === id);
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Content not found' });
    }
    const updatedContent = {
      ...db.data.content[contentIndex],
      title: title || db.data.content[contentIndex].title,
      body: body || db.data.content[contentIndex].body,
      category: category || db.data.content[contentIndex].category,
      updatedAt: new Date().toISOString(),
      status: status || db.data.content[contentIndex].status,
    };
    db.data.content[contentIndex] = updatedContent;
    await db.write();
    res.json(updatedContent);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Error updating content' });
  }
});

// Delete content
app.delete('/api/content/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const { id } = req.params;
    await db.read();
    const initialLength = db.data.content.length;
    db.data.content = db.data.content.filter(item => item.id !== id);
    if (db.data.content.length === initialLength) {
      return res.status(404).json({ message: 'Content not found' });
    }
    await db.write();
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Error deleting content' });
  }
});

// Get all content
app.get('/api/content', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// Get content by ID
app.get('/api/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.read();
    const content = db.data.content.find(item => item.id === id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Error fetching content' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
