import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
  name: string;
  objective: string;
  days: number;
  level: string;
}

const ExerciseSchema: Schema = new Schema({
  name: { type: String, required: true },
  objective: { type: String, required: true },
  days: { type: Number, required: true },
  level: { type: String, required: true }
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);
