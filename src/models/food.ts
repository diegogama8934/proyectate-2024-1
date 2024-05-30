import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
  name: string;
  type: string;
  carbs: number;
  proteins: number;
  fats: number;
}

const FoodSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  carbs: { type: Number, required: true },
  proteins: { type: Number, required: true },
  fats: { type: Number, required: true }
});

export default mongoose.model<IFood>('Food', FoodSchema);
