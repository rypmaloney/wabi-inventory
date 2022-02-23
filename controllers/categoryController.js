var Category = require("../models/category");
var Item = require("../models/item");
var async = require("async");
const { body,validationResult } = require('express-validator');


//list all categories
exports.category_list = function (req, res, next) {
    Category.find({}, "name description type")
        .sort({ name: 1 })
        .exec(function (err, list_categories) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render("category_list", {
                title: "List of All Categories",
                category_list: list_categories,
            });
        });
};


// Display detail page for a specific category.
exports.category_detail = function (req, res, next) {
    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
              .exec(callback);
        },
    
        items_in_category: function(callback) {
            Item.find({ 'category': req.params.id })
              .exec(callback);
        },
    
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.category==null) { // No results.
            var err = new Error('Category not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('category_detail', { title: results.category.name, category: results.category, items_in_category: results.items_in_category } );
    });
};

//Display all categories for each of the three main types 
exports.type_category = function (req, res, next) {
    let type = capitalizeFirstLetter(req.params.id) 
    
    Category.find({type: type}, "name")
        .sort({ name: 1 })
        .exec(function (err, list_categories) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render("type_detail", {
                title: `List of Categories in ${req.params.id}`,
                category_list: list_categories,
            });
        });
};

exports.category_create_get = function (req, res, next) {
    res.render('category_form', { title: 'Create New Category' });
};

exports.category_create_post = [

    // Validate and sanitize the name field.
    body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
    body('type').escape(),
    body('description','Category description required').trim().isLength({ min: 1 }).escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      var category = new Category(
        { 
            name: req.body.name,
            type: req.body.type,
            description: req.body.description
        }
      );
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('category_form', { title: 'Create Category', category: category, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.

        // Check if Genre with same name already exists.
        Category.findOne({ 'name': req.body.name })
          .exec( function(err, found_category) {
             if (err) { return next(err); }
  
             if (found_category) {
               // Genre exists, redirect to its detail page.
               res.redirect(found_category.url);
             }
             else {
  
               category.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(category.url);
               });
  
             }
  
           });
      }
    }
  ];
  


//UTILITY FUNCTION
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }