import mongoose from 'mongoose';
import slugify from 'slugify';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

schema.pre('save', async function (done) {
  const slugBrandName = slugify(this.get('name'), { lower: true });
  this.set('slug', slugBrandName);
  done();
});

export default mongoose.model('Item', schema);
