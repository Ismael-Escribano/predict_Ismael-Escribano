'use strict'

const Prediction = require('../model/prediction')

async function crearEntrada(datosEntrada) {
    try {
        const prediction = new Prediction(datosEntrada);
        return await prediction.save();
    } catch (err) {
        throw new Error(`Error al guardar la predicción: ${err}`);
    }
}

module.exports = {crearEntrada}