const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  description: String,
  author: [{ type: Schema.Types.ObjectId, ref: 'Author' }],
  rating: Number,
  reviews: [
    {
      user: String,
      comments: String
    }
  ],
  owner: Schema.Types.ObjectId,
  location: { type: { type: String }, coordinates: [Number] },
  imageUrl: String,
}, {
    timestamps: true
  });

bookSchema.index({ location: '2dsphere' });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;