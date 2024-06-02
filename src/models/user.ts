import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  weight: number;
  height: number;
  age: number;
  password: string;
  gender: string;
  goal?: string;
  exerciseDays?: number;
  favorite?: {
    foods: Array<{ foodId: Schema.Types.ObjectId; portions: number }>;
    exercises: Array<Schema.Types.ObjectId>;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  goal: { type: String },
  exerciseDays: { type: Number },
  favorite: {
    foods: [{ foodId: { type: Schema.Types.ObjectId, ref: 'Food' }, portions: Number }],
    exercises: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]
  }
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema, "users");
