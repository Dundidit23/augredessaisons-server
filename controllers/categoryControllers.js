
const Category = require('../models/Category');

const addCategory = async (req, res) => {
  try {
    const { category } = req.body; // Récupère le champ 'category' du corps de la requête
    // if (!category) {
    //   return res.status(400).json({ message: 'Category is required' });
    // }

    // Vérifie si la catégorie existe déjà
    const existingCategory = await Category.findOne({ category });
    if (existingCategory) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    // Crée une nouvelle catégorie
    const newCategory = new Category({ category }); // Directement passer { category }
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(id, { category }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOneCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getOneCategory
};
