import Product from '../models/Product.mjs';
import Ingredient from '../models/Ingredients.mjs';
import Forum from '../models/Forum.mjs';
import ForumReply from '../models/ForumReply.mjs';
import User from '../models/User.mjs';
import bcrypt from 'bcrypt'
import express from 'express';
const router = express.Router();
router.post('/signup', async (req, res) => {
  try {
        let requestBody;

   
     if (Buffer.isBuffer(req.body)) {
      try {
        requestBody = JSON.parse(req.body.toString('utf8'));
      } catch (parseError) {
        console.error('Error parsing request body buffer:', parseError);
        return res.status(400).json({ error: 'Invalid JSON body.' });
      }
    } else {
      // Assume it's already an object (e.g., parsed by express.json() in local dev)
      requestBody = req.body;
    }
     const { name, email, password } = requestBody;

    console.log('Parsed request body:', requestBody); // Confirm it's now an object
    console.log('Password received for hashing:', password); // Confirm password is a string

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
    res.status.json({body: req.body});
  }
});
router.post('/login', async (req, res) => {
  try {
   
        let requestBody;

   
     if (Buffer.isBuffer(req.body)) {
      try {
        requestBody = JSON.parse(req.body.toString('utf8'));
      } catch (parseError) {
        console.error('Error parsing request body buffer:', parseError);
        return res.status(400).json({ error: 'Invalid JSON body.' });
      }
    } else {
      // Assume it's already an object (e.g., parsed by express.json() in local dev)
      requestBody = req.body;
    }
    const { email, password } = requestBody;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    console.error(`Error updating product with ID ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});
router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(400).json({ error: err.message });
  }
});
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: err.message });
  }
});
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(`Error fetching product with ID ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});
router.get('/ingredients/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.json(ingredient);
  } catch (err) {
    console.error(`Error fetching ingredient with ID ${req.params.id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});
router.get('/forum/posts', async (req, res) => {
  try {
    const posts = await Forum.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching forum posts:', err.message);
    res.status(500).json({ error: err.message });
  }
});
router.post('/forum/posts', async (req, res) => {
  try {
    const newPost = await Forum.create(req.body);
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating forum post:', err.message);
    res.status(400).json({ error: err.message });
  }
});
router.post('/users/:userId/save/:postId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, {
      $addToSet: { savedPosts: req.params.postId }
    }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Post saved successfully', user });
  } catch (err) {
    console.error(`Error saving post ${req.params.postId} for user ${req.params.userId}:`, err.message);
    res.status(400).json({ error: err.message });
  }
});
router.get('/users/:userId/saved-posts', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('savedPosts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.savedPosts);
  } catch (err) {
    console.error(`Error fetching saved posts for user ${req.params.userId}:`, err.message);
    res.status(400).json({ error: err.message });
  }
});
router.post('/forum/posts/:postId/reply', async (req, res) => {
  try {
    const post = await Forum.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Forum post not found' });
    }
    const reply = await ForumReply.create({
      ...req.body,
      postId: req.params.postId
    });
    res.status(201).json(reply);
  } catch (err) {
    console.error(`Error posting reply to post ${req.params.postId}:`, err.message);
    res.status(400).json({ error: err.message });
  }
});
export default router;