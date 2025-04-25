const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB connection
const dbURI = 'mongodb://localhost:27017/blogs';
mongoose.connect(dbURI)
  .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
  .catch((err) => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.static('designs'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/controllers', express.static('views/controllers'));
app.set('view engine', 'ejs');

// Blog Schema & Model
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  snippet: { type: String, required: true },
  body: { type: String, required: true }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

// Routes
// GET all blogs 
app.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('index', { title: 'Home', blogs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching blogs');
  }
});

// GET create blog form
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create Blog' });
});

// GET edit blog form 
app.get('/blogs/edit/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).render('404', { title: '404' });
    res.render('edit', { title: 'Edit Blog', blog });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching blog');
  }
});

// GET single blog
app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).render('404', { title: '404' });
    res.render('details', { title: blog.title, blog });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching blog');
  }
});

// POST new blog
app.post('/blogs', async (req, res) => {
  try {
    console.log('Received blog data:', req.body); // Add logging
    
    // Validate required fields
    if (!req.body.title || !req.body.snippet || !req.body.body) {
      console.error('Missing required fields');
      return res.status(400).send('All fields are required');
    }

    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    console.log('Saved blog:', savedBlog);
    res.redirect('/');
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).send('Error creating blog');
  }
});

// PUT update blog
app.put('/blogs/:id', async (req, res) => {
  try {
    const { title, snippet, body } = req.body;
    if (!title || !snippet || !body) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Update blog
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, snippet, body },
      { new: true, runValidators: true }
    );

    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ redirect: `/blogs/${blog._id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating blog' });
  }
});

// DELETE blog
app.delete('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ redirect: '/' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting blog' });
  }
});

// About page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// Redirect /about-us to /about
app.get('/about-us', (req, res) => {
  res.redirect('/about');
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});