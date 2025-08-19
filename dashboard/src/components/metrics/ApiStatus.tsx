import React, { useEffect, useState } from 'react';
import { ServerIcon, ActivityIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { ApiClient } from '../api/ApiClient';
import { useTheme } from '../theme/ThemeProvider';
export function ApiStatus() {
  const {
    getColorClass
  } = useTheme();
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await ApiClient.getApiStatus();
        setApiStatus(status);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch API status');
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);
  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>;
  }
  if (error || !apiStatus) {
    return <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">API Status</h2>
            <div className="flex items-center">
              <XCircleIcon size={18} className="text-red-500 mr-2" />
              <span className="text-sm font-medium text-red-500">
                Disconnected
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <ServerIcon size={32} className="text-red-400 mx-auto mb-2" />
          <p className="text-gray-700">Unable to connect to the API</p>
          <p className="text-sm text-gray-500 mt-1">
            Please check your connection or the API server status
          </p>
        </div>
      </div>;
  }
  const isHealthy = apiStatus.successRate >= 95;
  return <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">API Status</h2>
          <div className="flex items-center">
            {isHealthy ? <>
                <CheckCircleIcon size={18} className="text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-500">
                  Operational
                </span>
              </> : <>
                <ActivityIcon size={18} className="text-orange-500 mr-2" />
                <span className="text-sm font-medium text-orange-500">
                  Degraded
                </span>
              </>}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${getColorClass('bg', 'light')}`}>
            <ServerIcon size={20} className={getColorClass('text')} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Success Rate</p>
            <p className="text-xl font-semibold text-gray-800">
              {apiStatus.successRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">
              {apiStatus.successfulRequests} successful /{' '}
              {apiStatus.totalRequests} total
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${getColorClass('bg', 'light')}`}>
            <ActivityIcon size={20} className={getColorClass('text')} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Response Time</p>
            <p className="text-xl font-semibold text-gray-800">
              {apiStatus.responseTimeAvg.toFixed(0)}ms
            </p>
            <p className="text-xs text-gray-500">Average over all requests</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${getColorClass('bg', 'light')}`}>
            <ActivityIcon size={20} className={getColorClass('text')} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Request Rate</p>
            <p className="text-xl font-semibold text-gray-800">
              {apiStatus.requestsPerMinute}/min
            </p>
            <p className="text-xs text-gray-500">
              Last request:{' '}
              {new Date(apiStatus.lastRequest).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>;
}