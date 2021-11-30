import mongoose from 'mongoose';
import { IRefreshToken } from '../interfaces/IUser';

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  token: String,
  expires: Date,
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

schema.virtual('isExpired').get(function (this: { expires: any }): boolean {
  return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function (this: { revoked: any; isExpired: boolean }): boolean {
  return !this.revoked && !this.isExpired;
});

export default mongoose.model<IRefreshToken & mongoose.Document>('RefreshToken', schema);
