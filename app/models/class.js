var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// class schema
var ClassSchema   = new Schema({
	name: { type: String, required: true, index: { unique: true }},
    courseNumber: { type: String, required: true, index: { unique: true }},
	date: { type: Date, required: true },
    teacher: {type: String, requred: true}
});
