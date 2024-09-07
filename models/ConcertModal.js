import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const concertSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  venue: { type: String },
  location: { type: String },
  image: { type: String },
  participants: [{ type: Schema.Types.ObjectId, ref: 'Users' }]
});

const Concert = mongoose.model('Concert', concertSchema);

export default Concert;
