var Category = require('../models/category');
var Item = require('../models/item');
var async = require("async");


exports.index = function(req, res) {

    async.parallel({
        item_count: function(callback) {
            Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        category_count: function(callback) {
            Category.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Wabi Cycles Inventory', error: err, data: results });
    });
};







exports.item_list = function(req, res) {
        //Successful, so render
        res.render('item_list', { title: 'Item List'});
      
}