var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// user schema
var ClassSchema   = new Schema({
	name: { type: String, required: true, index: { unique: true }},
	time: { type: Date, required: true},
    teacher: {type: String, requred: true}
});
