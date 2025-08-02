import { Schema, model } from 'mongoose';


const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  savedPosts: [{ type: Schema.Types.ObjectId, ref: 'ForumPost' }]
}, { timestamps: true });

export default model('User', userSchema, 'USER');
