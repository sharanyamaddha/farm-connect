const mongoose = require('mongoose');
require('dotenv').config(); // uses MONGO_URI from your .env

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const subcategorySchema = new mongoose.Schema({}, { strict: false });
const Subcategory = mongoose.model('Subcategory', subcategorySchema, 'subcategories');

async function renameField() {
  try {
    const result = await Subcategory.updateMany(
      { category: { $exists: true } },
      { $rename: { category: 'categoryId' } }
    );

    console.log(`✅ Renamed field in ${result.modifiedCount} subcategories`);
  } catch (error) {
    console.error('❌ Error renaming fields:', error);
  } finally {
    mongoose.disconnect();
  }
}

renameField();
