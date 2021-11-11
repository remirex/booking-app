import mongoose from 'mongoose';
import slugify from 'slugify';

import { IItem } from '@/interfaces/IItem';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  }
}, {
  timestamps: true,
});

schema.pre('save', async function (done) {
  const slugItemName = slugify(this.get('name'), { lower: true });
  this.set('slug', slugItemName);
  done();
});

export default mongoose.model<IItem & mongoose.Document>('Item', schema);
