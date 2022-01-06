import mongoose from 'mongoose';
import { IUpload } from '../interfaces/IUpload';

const schema = new mongoose.Schema(
  {
    path: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUpload & mongoose.Document>('Upload', schema);
