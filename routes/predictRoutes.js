// routes/predictRoutes.js
const express = require("express");
const router = express.Router();

const predictController = require("../controllers/predictController");

// Contrato del servicio PREDICT
router.get("/health", predictController.health);
router.get("/ready", predictController.ready);
router.post("/predict", predictController.doPredict);
router.get("/predict", predictController.obtenerTodasPredicciones);
router.get("/predict/:id", predictController.obtenerPrediccionPorId);
router.delete("/predict/:id", predictController.eliminarPrediccion);

module.exports = router;
