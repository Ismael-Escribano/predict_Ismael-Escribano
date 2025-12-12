// controllers/predictController.js
const { getModelInfo, predict } = require("../services/tfModelService");
const predictService = require('../services/predictService');

function health(req, res) {
  res.json({
    status: "ok",
    service: "predict"
  });
}

function ready(req, res) {
  const info = getModelInfo();

  if (!info.ready) {
    return res.status(503).json({
      ready: false,
      modelVersion: info.MODEL_VERSION,
      message: "Model is still loading"
    });
  }

  res.json({
    ready: true,
    modelVersion: info.MODEL_VERSION
  });
}

async function doPredict(req, res) {
  const start = Date.now();

  try {
    const info = getModelInfo();
    if (!info.ready) {
      return res.status(503).json({
        error: "Model not ready",
        ready: false
      });
    }

    const { features, meta } = req.body;

    if (!features) {
      return res.status(400).json({ error: "Missing features" });
    }
    if (!meta || typeof meta !== "object") {
      return res.status(400).json({ error: "Missing meta object" });
    }

    const { featureCount } = meta;

    if (featureCount !== info.inputDim) {
      return res.status(400).json({
        error: `featureCount must be ${info.inputDim}, received ${featureCount}`
      });
    }

    if (!Array.isArray(features) || features.length !== info.inputDim) {
      return res.status(400).json({
        error: `features must be an array of ${info.inputDim} numbers`
      });
    }

    const prediction = await predict(features);
    const latencyMs = Date.now() - start;
    const timestamp = new Date().toISOString();

    const datosEntrada = {
      prediction: prediction,
      features: features,
      featureCount: featureCount,
      source: req.source,
      timestamp: timestamp,
      latencyMs: latencyMs
    }
    const predictionStored = await predictService.crearEntrada(datosEntrada)
    
    res.status(201).json({
      predictionId: predictionStored.id,
      prediction: prediction,
      timestamp: timestamp,
      latencyMs: latencyMs
    });
  } catch (err) {
    console.error("Error en /predict:", err);
    res.status(500).json({ error: "Internal error" });
  }
}

async function obtenerPrediccionPorId (req, res) {
    let prediccionId = req.params.id;
    try {
        const prediction = await predictService.obtenerPrediccionPorId(prediccionId);
        if (!prediction) {
            return res.status(404).send({ mensaje: 'La predicción no existe' });
        }
        res.status(200).send({ prediction });
    } catch (err) {
        res.status(500).send({ mensaje: `Error al realizar la petición: ${err.message}`});
    }
}

async function obtenerTodasPredicciones(req, res) {
    try {
        const predictions = await predictService.obtenerTodasPredicciones();
        if (!predictions) {
            return res.status(404).send({ mensaje: 'No existen predicciones' });
        }
        res.status(200).send({ prediction: predictions });
    } catch (err) {
        res.status(500).send({ mensaje: `Error al obtener las predicciones: ${err.message}`});
    }
}

async function eliminarPrediccion(req, res) {
    let prediccionId = req.params.id
    try {
        const predictionDeleted = await predictService.eliminarPrediccion(prediccionId);
        if (!predictionDeleted) {
            return res.status(404).send({ mensaje: 'La predicción no existe' });
        }
        res.status(200).send({ prediction: predictionDeleted });
    } catch (err) {
        res.status(500).send({ mensaje: `Error al eliminar la predicción: ${err.message}`})
    }
}


module.exports = {
  health,
  ready,
  doPredict,
  obtenerPrediccionPorId,
  obtenerTodasPredicciones,
  eliminarPrediccion
};
