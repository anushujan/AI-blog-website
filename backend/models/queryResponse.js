const mongoose = require('mongoose');

// Define schema
const queryResponseSchema = new mongoose.Schema({
    query: {
        type: [String],
        required: true
    },
    response: {
        type: String,
        required: true
    }
});

// Create model
const QueryResponse = mongoose.model('QueryResponse', queryResponseSchema);

module.exports = QueryResponse;
