// import mongo
const mongoose = require('mongoose');

// define schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
});

// name the schema
const Item = mongoose.model('Item', itemSchema);
// create the schema
module.exports = Item;