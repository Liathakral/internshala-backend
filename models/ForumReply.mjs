import { Schema, model } from 'mongoose';

const forumReplySchema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'ForumPost' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default model('ForumReply', forumReplySchema, 'forum_replies'); 