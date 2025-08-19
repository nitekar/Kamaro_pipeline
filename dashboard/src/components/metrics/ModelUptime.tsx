import React from 'react';
import { ClockIcon, ActivityIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
export function ModelUptime() {
  // Mock data for model uptime
  const uptimeData = {
    uptime: '99.8%',
    status: 'Operational',
    lastIncident: '14 days ago',
    responseTime: '125ms',
    predictions: '1.2M',
    avgAccuracy: '94.2%'
  };
  return <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">
            Model Status & Uptime
          </h2>
          <div className="flex items-center">
            <CheckCircleIcon size={18} className="text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-500">
              {uptimeData.status}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-50">
            <ClockIcon size={20} className="text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Uptime</p>
            <p className="text-xl font-semibold text-gray-800">
              {uptimeData.uptime}
            </p>
            <p className="text-xs text-gray-500">
              Last incident: {uptimeData.lastIncident}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-50">
            <ActivityIcon size={20} className="text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Response Time</p>
            <p className="text-xl font-semibold text-gray-800">
              {uptimeData.responseTime}
            </p>
            <p className="text-xs text-gray-500">Avg. over last 24 hours</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-50">
            <AlertTriangleIcon size={20} className="text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Predictions</p>
            <p className="text-xl font-semibold text-gray-800">
              {uptimeData.predictions}
            </p>
            <p className="text-xs text-gray-500">
              Accuracy: {uptimeData.avgAccuracy}
            </p>
          </div>
        </div>
      </div>
    </div>;
}