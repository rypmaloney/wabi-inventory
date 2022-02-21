var Category = require("../models/category");
var Item = require("../models/item");
var async = require("async");


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


