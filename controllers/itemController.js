

exports.index = function(req, res) {

    //Successful, so render
    res.render('index', { title: 'index'});
  
}

exports.item_list = function(req, res) {
        //Successful, so render
        res.render('item_list', { title: 'Item List'});
      
}