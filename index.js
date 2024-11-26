// Imports being saved as consts

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import models

const Item = require('./models/item');

// Inits

const app = express(); // web application framework
app.use(bodyParser.json()); // // Middleware to parse incoming JSON requests

const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/mydatabase'; // Replace with your database URI , the db will be created automatically when you insert data into it for the first time.

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// CREATE 
app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body); // passed as body in the request as this is often used with POST, PUT, or PATCH requests.
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ, or read with filters= http://localhost:3000/items?price=1000&name=product, db actually performs the filtering
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// example: http://localhost:3000/products/6745beff5273cf2cbb42af0b
app.get('/items/:id', async (req, res) => { // here the parameter is passed in the URL
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE (acting more like a PATCH really is it does not overwrite missing fields)
// you may send as the body, only what is changing, not necessarily the whole object
app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete('/items/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(deletedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});