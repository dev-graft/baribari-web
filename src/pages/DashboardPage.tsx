import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, TrendingUp, Users, Activity, Star, Eye, Download, Wrench } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('7d');

  const usageData = [
    { name: t('dashboard.week.mon'), value: 45 },
    { name: t('dashboard.week.tue'), value: 32 },
    { name: t('dashboard.week.wed'), value: 67 },
    { name: t('dashboard.week.thu'), value: 89 },
    { name: t('dashboard.week.fri'), value: 54 },
    { name: t('dashboard.week.sat'), value: 23 },
    { name: t('dashboard.week.sun'), value: 12 },
  ];

  const toolUsageData = [
    { name: t('tools.tools_list.unit_converter.name'), value: 45, color: '#3B82F6' },
    { name: t('tools.tools_list.json_formatter.name'), value: 32, color: '#10B981' },
    { name: t('tools.tools_list.base64_converter.name'), value: 28, color: '#8B5CF6' },
    { name: t('tools.tools_list.timestamp_converter.name'), value: 23, color: '#F59E0B' },
    { name: t('tools.tools_list.url_encoder.name'), value: 18, color: '#EF4444' },
  ];

  const recentActivity = [
    {
      id: 1,
      tool: t('tools.tools_list.json_formatter.name'),
      action: t('dashboard.activity.used'),
      timestamp: t('dashboard.activity.minutes_ago', { count: 2 }),
      icon: '🔧',
    },
    {
      id: 2,
      tool: t('tools.tools_list.unit_converter.name'),
      action: t('dashboard.activity.used'),
      timestamp: t('dashboard.activity.minutes_ago', { count: 15 }),
      icon: '📏',
    },
    {
      id: 3,
      tool: t('tools.tools_list.base64_converter.name'),
      action: t('dashboard.activity.used'),
      timestamp: t('dashboard.activity.hours_ago', { count: 1 }),
      icon: '🔐',
    },
    {
      id: 4,
      tool: t('tools.tools_list.timestamp_converter.name'),
      action: t('dashboard.activity.used'),
      timestamp: t('dashboard.activity.hours_ago', { count: 2 }),
      icon: '⏰',
    },
  ];

  const stats = [
    {
      title: t('dashboard.stats.total_usage'),
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-blue-500',
    },
    {
      title: t('dashboard.stats.tools_used'),
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Wrench,
      color: 'bg-green-500',
    },
    {
      title: t('dashboard.stats.favorites'),
      value: '5',
      change: '+1',
      changeType: 'positive',
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      title: t('dashboard.stats.this_week_usage'),
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  const timeRangeOptions = [
    { value: '7d', label: t('dashboard.time_range.days', { count: 7 }) },
    { value: '30d', label: t('dashboard.time_range.days', { count: 30 }) },
    { value: '90d', label: t('dashboard.time_range.days', { count: 90 }) },
    { value: '1y', label: t('dashboard.time_range.year', { count: 1 }) },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('common.dashboard')}
          </h1>
          <p className="text-gray-600">
            {t('dashboard.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.usage_over_time')}</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input-field w-auto"
              >
                {timeRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.tool_usage_distribution')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={toolUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {toolUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.recent_activity')}</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.tool} {activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.popular_tools')}</h3>
            <div className="space-y-4">
              {toolUsageData.slice(0, 5).map((tool, index) => (
                <div key={tool.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                         style={{ backgroundColor: tool.color }}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">{t('dashboard.times', { count: tool.value })}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quick_actions.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="card hover:shadow-lg transition-all duration-200 text-left group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Eye className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.quick_actions.view_history')}</h4>
              <p className="text-gray-600 text-sm">{t('dashboard.quick_actions.view_history_desc')}</p>
            </button>

            <button className="card hover:shadow-lg transition-all duration-200 text-left group">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.quick_actions.manage_favorites')}</h4>
              <p className="text-gray-600 text-sm">{t('dashboard.quick_actions.manage_favorites_desc')}</p>
            </button>

            <button className="card hover:shadow-lg transition-all duration-200 text-left group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.quick_actions.export_data')}</h4>
              <p className="text-gray-600 text-sm">{t('dashboard.quick_actions.export_data_desc')}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;