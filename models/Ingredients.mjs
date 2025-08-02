import { Schema, model } from 'mongoose';

const ingredientSchema = new Schema({
  name: String,
  scientificName: String,
  sanskritName: String,
  description: String,
  whyUse: [String],
  prakritiImpact: {
    vata: String,
    kapha: String,
    pitta: String
  },
  benefits: [String],
  properties: {
    rasa: String,
    veerya: String,
    guna: String,
    vipaka: String
  },
  formulations: [String],
  therapeuticUses: [String],
  plantParts: [{ part: String, purpose: String }],
  combinedWith: [String],
  locations: [String],
  image: String
}, { timestamps: true });

export default model('Ingredient', ingredientSchema, 'ingredients'); 