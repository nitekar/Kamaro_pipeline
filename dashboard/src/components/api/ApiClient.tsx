import React from 'react';
import axios from 'axios';
// Configure API base URL
const API_BASE_URL = 'https://your-render-api-url.onrender.com/api';
// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
// API methods
export const ApiClient = {
  // Model prediction
  predict: async (data: any) => {
    try {
      const response = await apiClient.post('/predict', {
        data
      });
      return response.data;
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  },
  // Start model retraining
  retrain: async (dataset: any) => {
    try {
      const response = await apiClient.post('/retrain', {
        dataset
      });
      return response.data;
    } catch (error) {
      console.error('Retraining error:', error);
      throw error;
    }
  },
  // Get training status
  getTrainingStatus: async (trainingId: string) => {
    try {
      const response = await apiClient.get(`/training-status/${trainingId}`);
      return response.data;
    } catch (error) {
      console.error('Training status error:', error);
      throw error;
    }
  },
  // Get visualization data
  getVisualizationData: async (type: string) => {
    try {
      const response = await apiClient.get(`/visualization?type=${type}`);
      return response.data;
    } catch (error) {
      console.error('Visualization data error:', error);
      throw error;
    }
  },
  // Get model information
  getModelInfo: async () => {
    try {
      const response = await apiClient.get('/model-info');
      return response.data;
    } catch (error) {
      console.error('Model info error:', error);
      throw error;
    }
  },
  // Get API status
  getApiStatus: async () => {
    try {
      const response = await apiClient.get('/status');
      return response.data;
    } catch (error) {
      console.error('API status error:', error);
      return {
        status: 'error',
        message: 'Unable to connect to API'
      };
    }
  },
  // Health check
  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      return {
        status: 'DOWN'
      };
    }
  }
};