import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from '../routes/api.mjs';
import serverless from 'serverless-http';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI, 
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

router.get('/', (req, res) => {
  res.json({ message: 'Server is live!' });
});

app.use('/.netlify/functions/App', router);
export const handler = serverless(app);
