import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../../services/assetService';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Package, 
  CheckCircle, 
  Clock, 
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Building,
  Tag
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-xl text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Failed to load dashboard data</p>
          </div>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Approved', value: stats.approvedAssets, color: '#10b981' },
    { name: 'Pending', value: stats.unapprovedAssets, color: '#f59e0b' },
    { name: 'Active', value: stats.activeAssets, color: '#3b82f6' },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6'];

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Asset Dashboard</h1>
          <p className="text-xl text-gray-600">Real-time overview of your asset management system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Assets"
            value={stats.totalAssets}
            icon={Package}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Active Assets"
            value={stats.activeAssets}
            icon={Activity}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            title="Approved Assets"
            value={stats.approvedAssets}
            icon={CheckCircle}
            color="text-emerald-600"
            bgColor="bg-emerald-100"
          />
          <StatCard
            title="Pending Approval"
            value={stats.unapprovedAssets}
            icon={Clock}
            color="text-amber-600"
            bgColor="bg-amber-100"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Asset Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <PieChartIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Asset Status Distribution</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Assets']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Assets by Category</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryCounts} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Assets']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Building className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Assets by Department</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.departmentCounts} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="department" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Assets']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gray-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Quick Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{stats.totalAssets}</p>
              <p className="text-sm text-blue-700 font-medium">Total Assets</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.activeAssets}</p>
              <p className="text-sm text-green-700 font-medium">Active Assets</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">{stats.approvedAssets}</p>
              <p className="text-sm text-emerald-700 font-medium">Approved Assets</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">{stats.unapprovedAssets}</p>
              <p className="text-sm text-amber-700 font-medium">Awaiting Approval</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;