var Category = require("../models/category");
var Item = require("../models/item");
var async = require("async");

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
