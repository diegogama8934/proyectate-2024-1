import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise extends Document {
  Nombre: string;
  Objetivo: string;
  Dias: number;
  Nivel: string;
}

const ExerciseSchema: Schema = new Schema({
  Nombre: { type: String, required: true },
  Objetivo: { type: String, required: true },
  Dias: { type: Number, required: true },
  Nivel: { type: String, required: true }
});

export default mongoose.model<IExercise>("Exercise", ExerciseSchema, "Rutinas");
