//categoriesRoutes.js

const express = require('express');
const router = express.Router();
const { 
  addCategory,
  getAllCategories, 
  updateCategory, 
  deleteCategory, 
  getOneCategory 
} = require('../controllers/categoryControllers');

// Route to handle getting all categories and adding a new category
router.route("/")
  .get(getAllCategories)  // GET request to fetch all categories
  .post(addCategory);     // POST request to add a new category

// Route to handle operations on a specific category by ID
router.route("/:id")
  .get(getOneCategory)    // GET request to fetch a category by ID
  .put(updateCategory)    // PUT request to update a category by ID
  .delete(deleteCategory);// DELETE request to remove a category by ID

module.exports = router;