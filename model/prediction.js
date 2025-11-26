'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PredictionSchema = new Schema({
    prediction: { type: Number, required: true },
    features: Array,
    timestamp: Date,
    latencyMs: Number
});

module.exports = mongoose.model('Prediction', PredictionSchema);