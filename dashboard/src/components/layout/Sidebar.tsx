import React, { useState } from 'react';
import { LayoutDashboardIcon, ActivityIcon, BrainCircuitIcon, SettingsIcon, LogOutIcon, MenuIcon } from 'lucide-react';
interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export function Sidebar({
  activeTab,
  setActiveTab
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboardIcon size={20} />
  }, {
    id: 'training',
    label: 'Training',
    icon: <BrainCircuitIcon size={20} />
  }, {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon size={20} />
  }];
  return <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!collapsed && <div className="flex items-center">
              <ActivityIcon className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-800">
                MalNutrition ML
              </span>
            </div>}
          {collapsed && <ActivityIcon className="h-6 w-6 text-blue-600 mx-auto" />}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-md hover:bg-gray-100">
            <MenuIcon size={18} />
          </button>
        </div>
        <div className="flex-1 py-6">
          <nav className="px-2 space-y-1">
            {menuItems.map(item => <button key={item.id} className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setActiveTab(item.id)}>
                <span className={collapsed ? 'mx-auto' : ''}>{item.icon}</span>
                {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
              </button>)}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button className={`flex items-center w-full px-3 py-2 text-left rounded-md text-gray-600 hover:bg-gray-100 transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <LogOutIcon size={20} />
            {!collapsed && <span className="ml-3 text-sm font-medium">Log out</span>}
          </button>
        </div>
      </div>
    </div>;
}