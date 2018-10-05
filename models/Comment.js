var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create model from the schema
var Comment = mongoose.model("Comment", new Schema({
    title: String,
    body: String,
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        unique: true,
        required: true
    }
}));

module.exports = Comment;
