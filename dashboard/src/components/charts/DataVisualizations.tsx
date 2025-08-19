import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ApiClient } from '../api/ApiClient';
export function DataVisualizations() {
  const [timeRange, setTimeRange] = useState('month');
  const [regionalData, setRegionalData] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [ageDistributionData, setAgeDistributionData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch regional data
        const regional = await ApiClient.getVisualizationData('regional');
        setRegionalData(regional.data);
        // Fetch time series data
        const timeSeries = await ApiClient.getVisualizationData('timeSeries');
        setTimeSeriesData(timeSeries.data);
        // Fetch age distribution data
        const ageDistribution = await ApiClient.getVisualizationData('ageDistribution');
        setAgeDistributionData(ageDistribution.data);
      } catch (error) {
        console.error('Error fetching visualization data:', error);
        // Fallback to mock data if API fails
        setRegionalData([{
          region: 'North',
          stunting: 32,
          wasting: 14,
          underweight: 24
        }, {
          region: 'South',
          stunting: 24,
          wasting: 8,
          underweight: 18
        }, {
          region: 'East',
          stunting: 28,
          wasting: 12,
          underweight: 22
        }, {
          region: 'West',
          stunting: 18,
          wasting: 6,
          underweight: 14
        }, {
          region: 'Central',
          stunting: 26,
          wasting: 10,
          underweight: 20
        }]);
        setTimeSeriesData([{
          month: 'Jan',
          cases: 420,
          interventions: 380
        }, {
          month: 'Feb',
          cases: 380,
          interventions: 350
        }, {
          month: 'Mar',
          cases: 400,
          interventions: 390
        }, {
          month: 'Apr',
          cases: 350,
          interventions: 330
        }, {
          month: 'May',
          cases: 320,
          interventions: 310
        }, {
          month: 'Jun',
          cases: 300,
          interventions: 290
        }]);
        setAgeDistributionData([{
          name: '0-6 months',
          value: 25
        }, {
          name: '7-12 months',
          value: 30
        }, {
          name: '1-2 years',
          value: 20
        }, {
          name: '2-5 years',
          value: 25
        }]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  if (loading) {
    return <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">
            Data Visualizations
          </h2>
          <div className="flex space-x-2">
            <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">
          Data Visualizations
        </h2>
        <div className="flex space-x-2">
          <button onClick={() => setTimeRange('week')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Week
          </button>
          <button onClick={() => setTimeRange('month')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Month
          </button>
          <button onClick={() => setTimeRange('year')} className={`px-3 py-1 text-sm rounded-md ${timeRange === 'year' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Year
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Malnutrition Data */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-4">
            Regional Malnutrition Indicators
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis label={{
                value: 'Percentage (%)',
                angle: -90,
                position: 'insideLeft'
              }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="stunting" fill="#8884d8" name="Stunting" />
                <Bar dataKey="wasting" fill="#82ca9d" name="Wasting" />
                <Bar dataKey="underweight" fill="#ffc658" name="Underweight" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Time Series Data */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-4">
            Cases vs Interventions Over Time
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cases" stroke="#8884d8" activeDot={{
                r: 8
              }} name="Malnutrition Cases" />
                <Line type="monotone" dataKey="interventions" stroke="#82ca9d" name="Interventions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Age Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-4">
            Age Distribution of Malnutrition
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ageDistributionData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {ageDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Key Metrics Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-4">
            Key Metrics Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Cases</p>
              <p className="text-2xl font-bold text-gray-800">2,170</p>
              <p className="text-xs text-green-600">↓ 8.3% from last month</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Intervention Rate</p>
              <p className="text-2xl font-bold text-gray-800">94.2%</p>
              <p className="text-xs text-green-600">↑ 2.1% from last month</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Recovery Rate</p>
              <p className="text-2xl font-bold text-gray-800">78.5%</p>
              <p className="text-xs text-green-600">↑ 3.7% from last month</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Avg. Treatment Duration</p>
              <p className="text-2xl font-bold text-gray-800">42 days</p>
              <p className="text-xs text-green-600">↓ 3 days from last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}