import React, { useEffect, useState } from 'react';
import { PlayIcon, PauseIcon, RefreshCwIcon, DatabaseIcon, CheckCircleIcon, XCircleIcon, UploadIcon } from 'lucide-react';
import { DataUpload } from './DataUpload';
import { useTheme } from '../theme/ThemeProvider';
import { ApiClient } from '../api/ApiClient';
export function ModelTraining() {
  const {
    getColorClass
  } = useTheme();
  const [activeTab, setActiveTab] = useState<'controls' | 'upload'>('controls');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentTrainingId, setCurrentTrainingId] = useState<string | null>(null);
  const [trainingHistory, setTrainingHistory] = useState([{
    id: 1,
    date: '2023-10-15',
    accuracy: '93.2%',
    loss: '0.087',
    status: 'completed'
  }, {
    id: 2,
    date: '2023-09-30',
    accuracy: '92.7%',
    loss: '0.094',
    status: 'completed'
  }, {
    id: 3,
    date: '2023-09-15',
    accuracy: '91.8%',
    loss: '0.103',
    status: 'completed'
  }]);
  // Poll training status when training is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTraining && currentTrainingId) {
      interval = setInterval(async () => {
        try {
          const status = await ApiClient.getTrainingStatus(currentTrainingId);
          setTrainingProgress(status.progress);
          if (status.status === 'completed') {
            setIsTraining(false);
            // Add new training record
            const newRecord = {
              id: trainingHistory.length + 1,
              date: new Date().toISOString().split('T')[0],
              accuracy: `${(status.finalMetrics.accuracy * 100).toFixed(1)}%`,
              loss: status.finalMetrics.loss.toFixed(3),
              status: 'completed'
            };
            setTrainingHistory([newRecord, ...trainingHistory]);
          }
        } catch (error) {
          console.error('Error polling training status:', error);
        }
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTraining, currentTrainingId, trainingHistory]);
  const startTraining = async () => {
    try {
      setIsTraining(true);
      setTrainingProgress(0);
      // Call API to start training
      const response = await ApiClient.retrain({
        name: 'Malnutrition Dataset 2023',
        size: '1.2GB',
        records: 15000
      });
      setCurrentTrainingId(response.trainingId);
    } catch (error) {
      console.error('Error starting training:', error);
      setIsTraining(false);
    }
  };
  const stopTraining = () => {
    setIsTraining(false);
  };
  const handleDataUploaded = async (dataset: any) => {
    setActiveTab('controls');
    try {
      setIsTraining(true);
      setTrainingProgress(0);
      // Call API to start training with new dataset
      const response = await ApiClient.retrain(dataset);
      setCurrentTrainingId(response.trainingId);
    } catch (error) {
      console.error('Error starting training with new data:', error);
      setIsTraining(false);
    }
  };
  return <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">
            Model Training & Retraining
          </h2>
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button onClick={() => setActiveTab('controls')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'controls' ? `border-${getColorClass('text', 'dark').split('-')[1]} ${getColorClass('text', 'dark')}` : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                Training Controls
              </button>
              <button onClick={() => setActiveTab('upload')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'upload' ? `border-${getColorClass('text', 'dark').split('-')[1]} ${getColorClass('text', 'dark')}` : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                <span className="flex items-center">
                  <UploadIcon size={16} className="mr-1" />
                  Upload New Data
                </span>
              </button>
            </nav>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {activeTab === 'controls' && <>
                  <h3 className="text-md font-medium text-gray-700 mb-4">
                    Training Controls
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Training Dataset
                      </label>
                      <div className="flex">
                        <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                          <option>Malnutrition Dataset 2023 (Updated)</option>
                          <option>Historical Dataset 2015-2022</option>
                          <option>Regional Dataset - Africa</option>
                          <option>Regional Dataset - Asia</option>
                        </select>
                        <button className="ml-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                          <DatabaseIcon size={18} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model Configuration
                      </label>
                      <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                        <option>Default Configuration (Recommended)</option>
                        <option>High Accuracy Configuration</option>
                        <option>Balanced Configuration</option>
                        <option>Custom Configuration</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Training Parameters
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Epochs
                          </label>
                          <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" value="50" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Batch Size
                          </label>
                          <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" value="32" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Learning Rate
                          </label>
                          <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" value="0.001" step="0.001" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Validation Split
                          </label>
                          <input type="number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" value="0.2" step="0.1" />
                        </div>
                      </div>
                    </div>
                    <div className="pt-2">
                      {!isTraining ? <button onClick={startTraining} className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${getColorClass('bg', 'dark')} hover:${getColorClass('bg', 'dark')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${getColorClass('border', 'dark').split('-')[1]}`}>
                          <PlayIcon size={16} className="mr-2" />
                          Start Training
                        </button> : <button onClick={stopTraining} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                          <PauseIcon size={16} className="mr-2" />
                          Stop Training
                        </button>}
                      <button className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <RefreshCwIcon size={16} className="mr-2" />
                        Reset
                      </button>
                    </div>
                  </div>
                </>}
              {activeTab === 'upload' && <>
                  <h3 className="text-md font-medium text-gray-700 mb-4">
                    Upload New Training Data
                  </h3>
                  <DataUpload onDataUploaded={handleDataUploaded} />
                </>}
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">
                Training Status
              </h3>
              {isTraining ? <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm font-medium ${getColorClass('text')}`}>
                        Training in progress...
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {trainingProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className={`${getColorClass('bg')} h-2.5 rounded-full`} style={{
                    width: `${trainingProgress}%`
                  }}></div>
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Live Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Current Epoch</p>
                        <p className="text-sm font-medium">
                          {Math.floor(trainingProgress / 2)}/50
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time Remaining</p>
                        <p className="text-sm font-medium">
                          {Math.floor((100 - trainingProgress) / 10)} minutes
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current Loss</p>
                        <p className="text-sm font-medium">
                          0.{Math.floor(100 - trainingProgress)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Current Accuracy
                        </p>
                        <p className="text-sm font-medium">
                          {90 + Math.floor(trainingProgress / 10)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div> : <div className="border rounded-md p-4 bg-gray-50">
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-2">
                      No active training session
                    </p>
                    <p className="text-sm text-gray-400">
                      Start a new training session using the controls on the
                      left or upload new data
                    </p>
                  </div>
                </div>}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Training History
                </h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Accuracy
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loss
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {trainingHistory.map(history => <tr key={history.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {history.date}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {history.accuracy}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {history.loss}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {history.status === 'completed' ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircleIcon size={12} className="mr-1" />
                                Completed
                              </span> : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                <XCircleIcon size={12} className="mr-1" />
                                Failed
                              </span>}
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}