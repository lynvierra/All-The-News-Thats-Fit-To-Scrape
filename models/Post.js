var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create model from the schema
var Post = mongoose.model("Post", new Schema({
    headline: {
        type: String,
        required: true
    },
    link: {
        type: String,
        unique: true,
        required: true
    }
}));

module.exports = Post;
