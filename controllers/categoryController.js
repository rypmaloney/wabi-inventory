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
                title: `List of categories of type ${req.params.id}`,
                category_list: list_categories,
            });
        });
};

exports.category_create_get = function (req, res, next) {
    res.render('category_form', { title: 'Create New Category' });
};


//Post function to create a new category
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
        // Check if CATEGORY with same name already exists.
        Category.findOne({ 'name': req.body.name })
          .exec( function(err, found_category) {
             if (err) { return next(err); }
  
             if (found_category) {
               // Category exists, redirect to its detail page.
               res.redirect(found_category.url);
             }
             else {
               category.save(function (err) {
                 if (err) { return next(err); }
                 // Category saved. Redirect to category detail page.
                 res.redirect(category.url);
               });
  
             }
  
           });
      }
    }
  ];
  

//// Display category update form on GET.
exports.category_update_get = function(req, res, next) {
  Category.findById(req.params.id)
  .exec(function (err, results) {
    if (err) {
        return next(err);
    }
    //Successful, so render
    res.render("category_form_update",{title:"Update Category", category: results })
});

}


////Update Category on POST
exports.category_update_post = [

  body("name", "Name must not be empty.").isLength({ min: 1 }).escape(),
  body("type", "type must not be empty.").isLength({ min: 1 }).escape(),
  body("description", "Item description required")
      .trim()
      .isLength({ min: 1 })
      .escape(),

      (req, res, next) => {

          // Extract the validation errors from a request.
          const errors = validationResult(req);
  
          // Create a item object with escaped/trimmed data and old id.
          var category = new Category(
            { 
              name: req.body.name,
              type: req.body.type,
              description: req.body.description,
              _id:req.params.id 
             });
  
             if (!errors.isEmpty()) {
              // There are errors. Render form again with sanitized values/error messages.
               //Successful, so render
               res.render("category_form_update", {
                title: "Update Category",
                category: category,
                errors: errors.array(),

            });
            return;
          }
          else {
              // Data from form is valid. Update the record.
              Category.findByIdAndUpdate(req.params.id, category, {}, function (err,thecategory) {
                  if (err) { return next(err); }
                     // Successful - redirect to the detail page
                     res.redirect(thecategory.url);
                  });
          }
      }
  ];





//UTILITY FUNCTION
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }