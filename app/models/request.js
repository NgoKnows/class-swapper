var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// user schema
var RequestSchema   = new Schema({
    user: {type: String, required: true},
	wanted: {type: ClassSchema, required: true},
	requestTime: {type: date, required: true},
    trading: {type: [ClassSchema]},
    offering: {type: [String]}
});
