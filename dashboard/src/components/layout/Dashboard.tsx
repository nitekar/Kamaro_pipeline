import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ModelUptime } from '../metrics/ModelUptime';
import { ApiStatus } from '../metrics/ApiStatus';
import { ModelInformation } from '../metrics/ModelInformation';
import { DataVisualizations } from '../charts/DataVisualizations';
import { ModelTraining } from '../training/ModelTraining';
import { ThemeSettings } from '../settings/ThemeSettings';
export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  return <div className="flex h-screen w-full bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            {activeTab === 'dashboard' && 'Malnutrition Analysis Dashboard'}
            {activeTab === 'training' && 'Model Training & Retraining'}
            {activeTab === 'settings' && 'Dashboard Settings'}
          </h1>
          {activeTab === 'dashboard' && <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ModelUptime />
                <ApiStatus />
              </div>
              <div className="mb-6">
                <ModelInformation />
              </div>
              <div className="mt-6">
                <DataVisualizations />
              </div>
            </>}
          {activeTab === 'training' && <ModelTraining />}
          {activeTab === 'settings' && <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Dashboard Settings
              </h2>
              <ThemeSettings />
            </div>}
        </div>
      </div>
    </div>;
}