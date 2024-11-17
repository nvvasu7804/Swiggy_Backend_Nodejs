const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: [String], required: true }, // Array of strings
  bestSeller: { type: [Boolean], required: true }, // Array of booleans
  description: { type: [String], required: true }, // Array of strings
  image: { type: String },
  firm: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", required: true },
});

module.exports = mongoose.model("Product", productSchema);
