const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, require: true},
    class: { type: String, required: true },
    level: {type: Number, required: true},
    backround: { type: String}
});

module.exports = mongoose.model('Player', playerSchema);