var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// request schema
var RequestSchema   = new Schema({
    username: {type: String, required: true},
	wanted: {type: String, required: true},
    trading: {type: [String]},
    offering: {type: [String]},
    date: {type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);
