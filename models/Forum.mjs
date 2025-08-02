import { Schema, model } from 'mongoose';

const forumPostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['question', 'thought'] },
  title: String,
  description: String,
  category: String,
  tags: [String],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  saves: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default model('ForumPost', forumPostSchema, 'forums'); 