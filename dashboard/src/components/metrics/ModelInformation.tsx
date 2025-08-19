import React, { useEffect, useState } from 'react';
import { BrainCircuitIcon, CheckCircleIcon, ClockIcon, InfoIcon } from 'lucide-react';
import { ApiClient } from '../api/ApiClient';
import { useTheme } from '../theme/ThemeProvider';
export function ModelInformation() {
  const {
    getColorClass
  } = useTheme();
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const info = await ApiClient.getModelInfo();
        setModelInfo(info);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch model information');
        setLoading(false);
      }
    };
    fetchModelInfo();
  }, []);
  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>;
  }
  if (error || !modelInfo) {
    return <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Model Information
        </h2>
        <div className="text-center py-6">
          <InfoIcon size={32} className="text-red-400 mx-auto mb-2" />
          <p className="text-gray-700">Unable to load model information</p>
          <p className="text-sm text-gray-500 mt-1">
            Please check your connection to the API
          </p>
        </div>
      </div>;
  }
  return <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">
            Model Information
          </h2>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              v{modelInfo.version}
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">
            {modelInfo.name}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon size={14} className="mr-1" />
            Last trained:{' '}
            {new Date(modelInfo.lastTrainedAt).toLocaleDateString()}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="border rounded-lg p-3">
            <p className="text-xs text-gray-500">Accuracy</p>
            <p className="text-lg font-semibold text-gray-800">
              {(modelInfo.accuracy * 100).toFixed(1)}%
            </p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-xs text-gray-500">Precision</p>
            <p className="text-lg font-semibold text-gray-800">
              {(modelInfo.precision * 100).toFixed(1)}%
            </p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-xs text-gray-500">Recall</p>
            <p className="text-lg font-semibold text-gray-800">
              {(modelInfo.recall * 100).toFixed(1)}%
            </p>
          </div>
          <div className="border rounded-lg p-3">
            <p className="text-xs text-gray-500">F1 Score</p>
            <p className="text-lg font-semibold text-gray-800">
              {(modelInfo.f1Score * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <BrainCircuitIcon size={16} className={`mr-1 ${getColorClass('text')}`} />
              Input Features
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {modelInfo.inputFeatures.map((feature: string, index: number) => <li key={index} className="flex items-center">
                  <CheckCircleIcon size={14} className="text-green-500 mr-1.5" />
                  {feature}
                </li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <BrainCircuitIcon size={16} className={`mr-1 ${getColorClass('text')}`} />
              Output Classes
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {modelInfo.outputClasses.map((cls: string, index: number) => <li key={index} className="flex items-center">
                  <CheckCircleIcon size={14} className="text-green-500 mr-1.5" />
                  {cls}
                </li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>;
}