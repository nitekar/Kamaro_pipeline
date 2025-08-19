import React from 'react';
import { PaletteIcon, CheckIcon } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
type ThemeColor = 'blue' | 'green' | 'purple' | 'orange' | 'teal';
interface ColorOption {
  name: string;
  value: ThemeColor;
  primaryColor: string;
  secondaryColor: string;
}
export function ThemeSettings() {
  const {
    currentTheme,
    changeTheme
  } = useTheme();
  const colorOptions: ColorOption[] = [{
    name: 'Blue (Default)',
    value: 'blue',
    primaryColor: 'bg-blue-600',
    secondaryColor: 'bg-blue-200'
  }, {
    name: 'Green',
    value: 'green',
    primaryColor: 'bg-green-600',
    secondaryColor: 'bg-green-200'
  }, {
    name: 'Purple',
    value: 'purple',
    primaryColor: 'bg-purple-600',
    secondaryColor: 'bg-purple-200'
  }, {
    name: 'Orange',
    value: 'orange',
    primaryColor: 'bg-orange-600',
    secondaryColor: 'bg-orange-200'
  }, {
    name: 'Teal',
    value: 'teal',
    primaryColor: 'bg-teal-600',
    secondaryColor: 'bg-teal-200'
  }];
  return <div className="space-y-6">
      <div>
        <div className="flex items-center mb-4">
          <PaletteIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-md font-medium text-gray-700">Color Theme</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorOptions.map(option => <button key={option.value} className={`border rounded-lg p-4 text-left flex items-center space-x-4 ${currentTheme === option.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} onClick={() => changeTheme(option.value)}>
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full overflow-hidden flex">
                  <div className={`h-full w-1/2 ${option.primaryColor}`}></div>
                  <div className={`h-full w-1/2 ${option.secondaryColor}`}></div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {option.name}
                </p>
                {currentTheme === option.value && <div className="flex items-center mt-1">
                    <CheckIcon className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-xs text-blue-500">Active</span>
                  </div>}
              </div>
            </button>)}
        </div>
      </div>
      <div className="border-t pt-6">
        <p className="text-sm text-gray-500">
          The selected color theme will be applied throughout the dashboard and
          saved for your next visit.
        </p>
      </div>
    </div>;
}