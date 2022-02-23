var Category = require("../models/category");
var Item = require("../models/item");
var async = require("async");
const { body,validationResult } = require('express-validator');

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


//list all items
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

//GET function for new item
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



// Display detail page for a specific book.
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


//Post funciton for new item
exports.item_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre ==='undefined')
            req.body.genre = [];
            else
            req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitize fields.
    body('name', 'name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];
