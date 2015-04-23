var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// request schema
var RequestSchema   = new Schema({
    username: {type: String, required: true},
	wanted: {type: String, required: true},
	requestTime: {type: Date, required: true},
    trading: {type: [String]},
    offering: {type: [String]}
});

module.exports = mongoose.model('Request', RequestSchema);
