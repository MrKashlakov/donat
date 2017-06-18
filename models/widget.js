import mongoose from 'mongoose';

export default mongoose.model('Widget', mongoose.Schema({
  account: String,
}));

