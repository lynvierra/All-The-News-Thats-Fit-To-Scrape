var request = require("request-promise-native");
var cheerio = require("cheerio");
var db = require("../models");

var options = {
    uri: 'http://www.cnn.com/entertainment',
    transform: function(body) {
        return cheerio.load(body);
    }
};

module.exports = function(app, npr) {
    app.get("/scrape", function(req, res) {
        request(options)
            .then(function($) {
                $('.zn-entertainment-zone-2 > .l-container article').each(function() {
                    var post = {
                        headline: $(this).find(".cd__headline-text").text()
                    };
                    var link = $(this).find('a').attr('href');
                    //Replaces any posts that already exist with the same link
                    db.posts.findOneAndUpdate({
                            link: link
                        },
                        post, {
                            upsert: true
                        }).exec();
                });
                res.send("Completed successfully");
            })
            .catch(function(err) {
                res.send("Error Crawling " + options.uri + " page: " + err);
            });
    });

    // Route for getting all Posts from the db
    app.get("/posts", function(req, res) {
        db.posts.find({}, function(posts) {
            res.json(posts);
        });
    });

    // Route for grabbing a specific Post by id, populate it with it's note
    app.get("/posts/:id", function(req, res) {
        db.posts.findOne({
                _id: req.params.id
            })
            .then(function(post) {
                db.comments.$where({
                    post: post._id
                }).then(() => res.json(post));
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating an Post's associated Comment
    app.post("/posts/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.comments
            .create(req.body)
            .then(function(dbComment) {
                // If a Comment was created successfully, find one Post with an `_id` equal to `req.params.id`. Update the PostP to be associated with the new Comment
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.posts.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    note: dbComment._id
                }, {
                    new: true
                });
            })
            .then(function(dbPost) {
                // If we were able to successfully update an PostP, send it back to the client
                res.json(dbPost);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
};
