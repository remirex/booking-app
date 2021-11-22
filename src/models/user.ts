import mongoose from 'mongoose';

import { UserRole, UserStatus } from '../helpers/enums/enums';
import { IUser } from '../interfaces/IUser';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    acceptTerms: {
      type: Boolean,
      required: true,
    },
    role: {
      type: String,
      default: UserRole.GUEST,
      enum: [UserRole.GUEST, UserRole.ADMIN],
    },
    status: {
      type: String,
      default: UserStatus.INACTIVE,
      enum: [UserStatus.INACTIVE, UserStatus.BANNED, UserStatus.ACTIVE],
    },
    verificationToken: {
      token: String,
      expires: Date,
    },
    verified: Date,
    resetToken: {
      token: String,
      expires: Date,
    },
    passwordReset: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser & mongoose.Document>('User', schema);
