#! /usr/bin/env node

console.log(
    "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: "
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var categories = [];

function categoryCreate(name, description, type, cb) {
    var category = new Category({
        name: name,
        description: description,
        type: type,
    });

    category.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log("New category: " + category);
        categories.push(category);
        cb(null, category);
    });
}

function itemCreate(name, description, category, type, price, stock, cb) {
    itemDetail = {
        name: name,
        description: description,
        category: category,
        type: type,
        price: price,
        stock: stock,
    };

    var item = new Item(itemDetail);
    item.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log("New item: " + item);
        items.push(item);
        cb(null, item);
    });
}

function createCategories(cb) {
    async.series(
        [
            function (callback) {
                categoryCreate(
                    "Complete Builds",
                    "Fully built bikes with standard components. The component mixes for the builds are also similar with some premium options or upgrades available as stock on our higher-end models.",
                    "Bike",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    "Framesets",
                    "Made from Reynolds 725 tubing with TIG welding (butted) at the joints.",
                    "Bike",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    "Bars / Stems / Tape",
                    "Handlebars, a variety of stems, and handlebar tape to customize your ride.",
                    "Component",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    "Brakes",
                    "You'll find a curated selection of brake calipers, levers and cables to fit most riders needs.",
                    "Component",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    "Cranksets",
                    "We've curated a selection of quality cranksets from Wabi, SRAM, Sugino and Miche that will fit the needs of most riders.",
                    "Component",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    "Gears / Chains",
                    "We've curated gears and chains to what we believe are the best options of good, better and best from our own brand to Sugino, White Industries, Phil Wood, EAI, Izumi and KMC.",
                    "Component",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    "Saddles",
                    "We've selected some of our favorite saddles for the fixed/single speed rider- from classic to comfort to performance- while still delivering on the Wabi aesthetic, including Brooks, Kashimax and Fizik.",
                    "Component",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    "Wheels",
                    "Wheels and tires to upgrade you're ride.",
                    "Component",
                    callback
                );
            },
            function (callback) {
                categoryCreate("Apparel", "Our gear", "Accessory", callback);
            },
            function (callback) {
                categoryCreate(
                    "Locks",
                    "Protect your purchase.",
                    "Accessory",
                    callback
                );
            },
            function (callback) {
                categoryCreate(
                    "Tools",
                    "Keep your bike tuned.",
                    "Accessory",
                    callback
                );
            },
        ],
        // optional callback
        cb
    );
}

function createItems(cb) {
    async.parallel(
        [
            function (callback) {
                itemCreate(
                    "Wabi Classic",
                    "The Classic is the core model in our lineup--Reynolds 725 steel, rock-solid components and our clean look at under 19 pounds. Each bike is built to order along with your choice of handlebars, saddles and more. Our current color options are Sable Green, a dark green, and Cloud Gray, a light/medium gray. Plus, custom color options are available for $250 and up as an after-purchase upgrade (contact us).",
                    categories[0],
                    "Bike",
                    995,
                    127,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Special",
                    "The Special is our lugged frame option with that unique look and feel of lugs that can go more vintage or modern depending on how you build it. ",
                    categories[0],
                    "Bike",
                    1025,
                    20,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Lightning",
                    "The Lighting is our lightest lugged frame option with that unique look and feel of lugs that can go more vintage or modern depending on how you build it. ",
                    categories[0],
                    "Bike",
                    1299,
                    0,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Urban",
                    "The Wabi Thunder is a versatile build that can go Urban or Cross/Gravel.  Using our Thunder frameset and wheelset, it takes wide tires (up to 50mm), lots of fender/rack options and a serious beating--all at under 20 lbs. ",
                    categories[0],
                    "Bike",
                    875,
                    349,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Thunder Frameset",
                    "The Wabi Thunder is a versatile frameset for urban or gravel adventures. With cantilever brakes and room for wide tires (up to 50mm), this bike will take you wherever you want to go.",
                    categories[1],
                    "Bike",
                    625,
                    0,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Lightning Frameset",
                    "Our Lightning frameset is our lightest option coming in at under 5 lbs. (55cm). It features Columbus Spirit tubing and a paint-matched carbon fork - light, responsive and sleek.",
                    categories[1],
                    "Bike",
                    750,
                    27,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Compact Handlebar",
                    "Our Wabi compact handlebars are a great option for those looking for a shorter reach than traditional drop bars.",
                    categories[2],
                    "Component",
                    24,
                    49,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Road Handlebar",
                    "Our Wabi road handlebar is a traditional road bar with a classic round drop. Great for offering a variety of hand positions and still offering a low position on your bike.   ",
                    categories[2],
                    "Component",
                    24,
                    39,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Bullhorn Handlebar",
                    "A popular shape, especially for fixed gears/single speeds that gives you two different hand positions. ",
                    categories[2],
                    "Component",
                    26,
                    0,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Gel Cork Padded Bartape",
                    "Our gel cork padded bar tape brings together comfort and a clean aesthetic. Ample padding and soft to the touch.",
                    categories[2],
                    "Component",
                    13,
                    340,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Brooks Cambium Leather Bar Tape",
                    "Good all-around leather tape that offers plenty of cushioning, and has a unique feel.",
                    categories[2],
                    "Component",
                    40,
                    3,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Logo Stem Cap",
                    "Our stem caps are the perfect accent to finish off a brand new build or to freshen up a tried and true daily rider. ",
                    categories[2],
                    "Component",
                    9,
                    239,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Brake Caliper",
                    "These brake calipers are a great choice for any single speed or fixed gear build. Low profile and great stopping power.  ",
                    categories[3],
                    "Component",
                    60,
                    89,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "SRAM Force Caliper Set",
                    "SRAM Force brakes offer strong braking performance in a sleek, modern look.",
                    categories[3],
                    "Component",
                    148,
                    9,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Drop Bar Lever",
                    "Our standard drop bar lever option. They offer great braking and are also very comfortable when riding in the hoods for long distances.",
                    categories[3],
                    "Component",
                    40,
                    39,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Crankset",
                    'Coming from legendary Japanese manufacturer Sugino, the RD2 is their entry-level track crankset with a 48t 3/32" chainring.',
                    categories[4],
                    "Component",
                    40,
                    39,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Suguino RD2 Crankset",
                    "Our stock crankset provides solid quality and value with the ability to choose any chainring size as needed.",
                    categories[4],
                    "Component",
                    95,
                    32,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Miche Advanced Crankset",
                    "The Miche Advanced Primato crankset is a high quality track crankset from the well-regraded Italian manufacturer of high-quality road and track components.",
                    categories[4],
                    "Component",
                    130,
                    0,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Chainring",
                    'Our stock chainring provides a good combo of quality and value. One of the only 3/32" 144BCD chainrings on the market.',
                    categories[5],
                    "Component",
                    45,
                    3,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Suguino 75 Chainring",
                    "Sugino's classic 75 chainrings delivering the highest quality and precision while providing that classic look.",
                    categories[5],
                    "Component",
                    43,
                    87,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Suguino Zen",
                    "Sugino's Zen chainrings are the ultimate disc-type chainring combining quality with high rigidity for racing or serious street riding.",
                    categories[5],
                    "Component",
                    245,
                    34,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Relaxed Saddle",
                    "Our most popular saddle - simple, lightweight and stylish - with a wider and longer profile for comfort.",
                    categories[6],
                    "Component",
                    30,
                    58,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Brooks Swallow Saddle",
                    "The classic Brooks leather saddle in a more minimalist, racing form.",
                    categories[6],
                    "Component",
                    195,
                    3,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Brooks B17 Saddle",
                    "The B17 is the classic Brooks leather saddle for maximum comfort. ",
                    categories[6],
                    "Component",
                    130,
                    0,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Lightweight Wheels",
                    "Reducing rotational wheel weight is one of the easiest ways to increase the responsiveness and acceleration of any bike. This wheel set accomplishes that while also being one of the most durable and economical options on the market. ",
                    categories[7],
                    "Component",
                    125,
                    33,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Gran Compe Wheelset",
                    "Heavy duty all-black urban 700C wheelset from Dia Compe of Japan.",
                    categories[7],
                    "Component",
                    485,
                    23,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Phil Wood Wheelset",
                    "Top-of-the-line wheelset that features Phil Wood Classic hubs, DT Competition spokes and H+ Son Archetype rims - all in silver. These wheels are the ultimate in performance and durability and should last you a lifetime. Contact us about discounted pricing if added as an upgrade to a build.",
                    categories[7],
                    "Component",
                    435,
                    23,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi Cycles Black T-Shirt",
                    "The Wabi Cycles logo T is a soft, lightweight t-shirt with our large logo on the front.",
                    categories[8],
                    "Accessory",
                    35,
                    23,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Wabi 5-Panel Hat",
                    "Clean and simple 5 panel hat.",
                    categories[8],
                    "Accessory",
                    5,
                    22,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Kryptonite New York",
                    "This lock is the highest security Kryptonite U-lock available, featuring a 16mm Kryptonium steel with double deadbolt design.",
                    categories[9],
                    "Accessory",
                    125,
                    0,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Kryptonite Evolution",
                    "Lightweight, easy to carry lock that still provides great security.",
                    categories[9],
                    "Accessory",
                    485,
                    23,
                    callback
                );
            },
            function (callback) {
                itemCreate(
                    "Axle Nut Tool",
                    "Compact 15mm wrench for standard axle nuts.",
                    categories[10],
                    "Accessory",
                    15,
                    3,
                    callback
                );
            },
        ],
        // optional callback
        cb
    );
}

async.series(
    [createCategories, createItems],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log("FINAL ERR: " + err);
        } else {
            console.log("items: " + items);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    }
);
