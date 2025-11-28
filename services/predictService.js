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

async function obtenerPrediccionPorId(id) {
    try {
        return await Prediction.findById(id);
    } catch (err) {
        throw new Error(`Error al obtener la predicción: ${err}`)
    }
}

async function obtenerTodasPredicciones() {
    try {
        return await Prediction.find();
    } catch (err) {
        throw new Error(`Error al obtener las predicciones: ${err}`)
    }
}

async function eliminarPrediccion(id) {
    try {
        return await Prediction.findByIdAndDelete(id);
    } catch (err) {
        throw new Error(`Error al eliminar la predicción: ${err}`)
    }
}

module.exports = {
    crearEntrada,
    obtenerPrediccionPorId,
    obtenerTodasPredicciones,
    eliminarPrediccion
}