import mongoose, { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface to define the properties of a User document
export interface IUser extends Document {
  username: string;
  email: string;
  password?: string; // Password is optional when fetching user data
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false, // Do not return password by default on queries
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Mongoose "pre-save" hook to hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  // Hash the password with a salt round of 12
  const salt = await bcrypt.genSalt(12);
  if(this.password){
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare candidate password with the user's hashed password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password || '');
};


const User = model<IUser>('User', userSchema);
export default User;
