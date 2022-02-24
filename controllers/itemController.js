var Category = require("../models/category");
var Item = require("../models/item");
var async = require("async");
const { body, validationResult } = require("express-validator");

//GET couts for index page
exports.index = function (req, res) {
    async.parallel(
        {
            item_count: function (callback) {
                Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
            },
            category_count: function (callback) {
                Category.countDocuments({}, callback);
            },
        },
        function (err, results) {
            res.render("index", {
                title: "Wabi Cycles Inventory",
                error: err,
                data: results,
            });
        }
    );
};

////GET list all items
exports.item_list = function (req, res, next) {
    Item.find({}, "name description")
        .sort({ name: 1 })
        .populate("category")
        .exec(function (err, list_items) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render("item_list", {
                title: "List of All Items",
                item_list: list_items,
            });
        });
};

////GET function for new item
exports.item_create_get = function (req, res, next) {
    Category.find({}, "name")
        .sort({ name: 1 })
        .exec(function (err, list_categories) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render("item_form", {
                title: "Create New Item",
                category_list: list_categories,
            });
        });
};

//// GET Display detail page for a specific book.
exports.item_detail = function (req, res, next) {
    Item.findById(req.params.id)
        .populate("category")
        .exec(function (err, item) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render("item_detail", { title: item.name, item: item });
        });
};


////Post funciton for new item
exports.item_create_post = [
    // Validate and sanitize fields.
    body("name", "Name must not be empty.").isLength({ min: 1 }).escape(),
    body("category", "Category must not be empty.")
        .isLength({ min: 1 })
        .escape(),
    body("type", "type must not be empty.").isLength({ min: 1 }).escape(),
    body("price", "Price must not be empty.").isLength({ min: 1 }).escape(),
    body("stock", "Stock must not be empty").isLength({ min: 1 }).escape(),
    body("description", "Item description required")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a item object with escaped and trimmed data.
        var item = new Item({
            name: req.body.name,
            category: req.body.category,
            type: req.body.type,
            price: req.body.price,
            stock: req.body.stock,
            description: req.body.description,
        });

        if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
            Category.find({}, "name")
                .sort({ name: 1 })
                .exec(function (err, list_categories) {
                    if (err) {
                        return next(err);
                    }
                    //Successful, so render
                    res.render("item_form", {
                        title: "Create New Item",
                        item: item,
                        errors: errors.array(),
                        category_list: list_categories,
                    });
                });
            return;
        } else {
            // Data from form is valid. Save item.
            item.save(function (err) {
                if (err) {
                    return next(err);
                }
                //successful - redirect to new item record.
                res.redirect(item.url);
            });
        }
    },
];


//// Display item update form on GET.
exports.item_update_get = function(req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id)
                .populate('category')
                .exec(callback);
        },
        categories: function(callback) {
            Category.find(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item==null) { // No results.
            var err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        res.render("item_form_update",{title:"Update Item", category_list: results.categories, item:results.item })
    });
}


//// Handle item update form on POST.
exports.item_update_post = [

    body("name", "Name must not be empty.").isLength({ min: 1 }).escape(),
    body("category", "Category must not be empty.")
        .isLength({ min: 1 })
        .escape(),
    body("type", "type must not be empty.").isLength({ min: 1 }).escape(),
    body("price", "Price must not be empty.").isLength({ min: 1 }).escape(),
    body("stock", "Stock must not be empty").isLength({ min: 1 }).escape(),
    body("description", "Item description required")
        .trim()
        .isLength({ min: 1 })
        .escape(),

        (req, res, next) => {

            // Extract the validation errors from a request.
            const errors = validationResult(req);
    
            // Create a item object with escaped/trimmed data and old id.
            var item = new Item(
              { name: req.body.name,
                category: req.body.category,
                type: req.body.type,
                price: req.body.price,
                stock: req.body.stock,
                description: req.body.description,
                _id:req.params.id 
               });
    
               if (!errors.isEmpty()) {
                // There are errors. Render form again with sanitized values/error messages.
                    Category.find({}, "name")
                        .sort({ name: 1 })
                        .exec(function (err, list_categories) {
                            if (err) {
                                return next(err);
                            }
                            //Successful, so render
                            res.render("item_form", {
                                title: "Create New Item",
                                item: item,
                                errors: errors.array(),
                                category_list: list_categories,
                            });
                        });
                    return;

            }
            else {
                // Data from form is valid. Update the record.
                Item.findByIdAndUpdate(req.params.id, item, {}, function (err,theitem) {
                    if (err) { return next(err); }
                       // Successful - redirect to item detail page
                       res.redirect(theitem.url);
                    });
            }
        }
    ];


//Route to GET delete form 
exports.item_delete_get = function(req, res, next) {

    Item.findById(req.params.id)
        .populate("category")
        .exec(function (err, item) {
            if (err) {
                return next(err);
            }
        // Successful, so render.
        res.render('item_delete', { title: `Delete ${item.name}`, item: item } );
    });

};


//Route to POST delete form 
exports.item_delete_post = function(req, res, next) {

    Item.findByIdAndDelete(req.params.id)
        .exec(function (err) {
            if (err) {
                return next(err);
            }
        // Successful, so render.
        res.redirect('/inventory/items');
    });

};