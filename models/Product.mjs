import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: String,
  subtitle: String,
  description: String,
  image: String,
  price: Number,
  quantityOptions: [{ label: String, price: Number }],
  primaryIngredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
  allIngredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
  usage: [String],
  dosage: [String],
  benefits: {
    primary: [String],
    secondary: [String]
  },
  faq: [{ question: String, answer: String }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default model('Product', productSchema, 'Products'); 
