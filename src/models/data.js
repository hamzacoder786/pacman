const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // },

    UserWallet: {
        type: String,
        required: 'Your UserWallet is required'
    },

    // score: {
    //     type: Number,
    //     required: 'Your score is required'
    // },

    // reserved: {
    //     type: Number,
    //     required: 'Your reserved is required'
    // },

    HiddenWallet: {
        type: String,
        required: 'Your HiddenWallet is required'
    },
    score: {
        type: String,
        required: 'Your score is required',
    },

    // result: {
    //     type: String,
    //     required: 'Your result is required'
    // },

    // gameId: {
    //     type: String,
    //     required: 'Your game id is required'
    // },
    
    // challengeprice: {
    //     type: Number,
    //     required: 'Your challengeprice is required'
    // },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now,    }

}, {timestamps: true});

module.exports = mongoose.model('data', dataSchema);