const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB connection
const dbURI = 'mongodb://localhost:27017/blogDB'; //papalitan ko ng url ng mongodb ko
mongoose.connect(dbURI)
  .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
  .catch((err) => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.static('designs'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/controllers', express.static('views/controllers'));

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

// Routes
// GET all blogs
app.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('index', { title: 'Home', blogs });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching blogs');
  }
});

// About page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// Redirect about-us to about
app.get('/about-us', (req, res) => {
  res.redirect('/about');
});

// GET create blog form
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create Blog' });
});

// POST new blog
app.post('/blogs', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error creating blog');
  }
});

// GET single blog
app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.render('details', { title: blog.title, blog });
    } else {
      res.status(404).render('404', { title: '404' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching blog');
  }
});

//Update Blog
app.put('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.json({ redirect: `/blogs/${req.params.id}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error updating blog' });
  }
});

// Edit Blog
app.get('/blogs/edit/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.render('edit', { title: 'Edit Blog', blog });
    } else {
      res.status(404).render('404', { title: '404' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching blog');
  }
});

// DELETE blog
app.delete('/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ redirect: '/' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error deleting blog' });
  }
});



// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});