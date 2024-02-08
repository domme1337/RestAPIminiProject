const mongoose = require('mongoose');

const campaignSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    campaignName: {type: String, required:true},
    worldSetting: {type: String, required:true},
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required:true},
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required:true},
    player3: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required:true},
    player4: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required:true}
});

module.exports = mongoose.model('Campaign', campaignSchema);