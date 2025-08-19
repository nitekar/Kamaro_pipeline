const express = require('express');
const router = express.Router();
const modelService = require('../services/modelService');
// Prediction endpoint
router.post('/predict', async (req, res, next) => {
  try {
    const {
      data
    } = req.body;
    if (!data) {
      return res.status(400).json({
        error: 'Missing data for prediction'
      });
    }
    const prediction = await modelService.predict(data);
    res.json({
      prediction
    });
  } catch (error) {
    next(error);
  }
});
// Retraining endpoint
router.post('/retrain', async (req, res, next) => {
  try {
    const {
      dataset
    } = req.body;
    if (!dataset) {
      return res.status(400).json({
        error: 'Missing dataset for retraining'
      });
    }
    // Start retraining in background
    modelService.retrain(dataset);
    res.json({
      message: 'Retraining started successfully',
      trainingId: modelService.getCurrentTrainingId()
    });
  } catch (error) {
    next(error);
  }
});
// Training status endpoint
router.get('/training-status/:id', async (req, res, next) => {
  try {
    const {
      id
    } = req.params;
    const status = modelService.getTrainingStatus(id);
    if (!status) {
      return res.status(404).json({
        error: 'Training job not found'
      });
    }
    res.json(status);
  } catch (error) {
    next(error);
  }
});
// Visualization data endpoint
router.get('/visualization', async (req, res, next) => {
  try {
    const {
      type
    } = req.query;
    if (!type) {
      return res.status(400).json({
        error: 'Missing visualization type'
      });
    }
    const data = await modelService.getVisualizationData(type);
    res.json(data);
  } catch (error) {
    next(error);
  }
});
// Model information endpoint
router.get('/model-info', async (req, res, next) => {
  try {
    const info = await modelService.getModelInfo();
    res.json(info);
  } catch (error) {
    next(error);
  }
});
// API status endpoint
router.get('/status', (req, res) => {
  const status = require('../utils/statusMonitor').getStatus();
  res.json(status);
});
module.exports = router;