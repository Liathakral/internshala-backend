import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './routes/api.mjs';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(
  `mongodb+srv://LiaThakral:Liathakral%4028@cluster0.pfx3dib.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB. Fetching collections...\n');
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  for (const collection of collections) {
    const name = collection.name;
    const docs = await db.collection(name).find({}).toArray();
    console.log(`📦 Collection: ${name}`);
    console.log(docs.length ? docs : '(empty)');
    console.log('-------------------------------------------\n');
  }
});
app.use('/api', router);
app.get('/', (req, res) => {
  res.send('Server is live!');
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
