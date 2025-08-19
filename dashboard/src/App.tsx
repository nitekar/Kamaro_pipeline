import React from 'react';
import { Dashboard } from './components/layout/Dashboard';
import { ThemeProvider } from './components/theme/ThemeProvider';
export function App() {
  return <ThemeProvider>
      <Dashboard />
    </ThemeProvider>;
}