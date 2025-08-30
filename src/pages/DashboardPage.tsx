import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, TrendingUp, Users, Activity, Star, Eye, Download, Wrench } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - 실제로는 API에서 가져와야 합니다
  const usageData = [
    { name: '월', value: 45 },
    { name: '화', value: 32 },
    { name: '수', value: 67 },
    { name: '목', value: 89 },
    { name: '금', value: 54 },
    { name: '토', value: 23 },
    { name: '일', value: 12 },
  ];

  const toolUsageData = [
    { name: '단위 변환', value: 45, color: '#3B82F6' },
    { name: 'JSON 포맷터', value: 32, color: '#10B981' },
    { name: 'Base64 변환', value: 28, color: '#8B5CF6' },
    { name: '타임스탬프 변환', value: 23, color: '#F59E0B' },
    { name: 'URL 인코더', value: 18, color: '#EF4444' },
  ];

  const recentActivity = [
    {
      id: 1,
      tool: 'JSON 포맷터',
      action: '사용',
      timestamp: '2분 전',
      icon: '🔧',
    },
    {
      id: 2,
      tool: '단위 변환',
      action: '사용',
      timestamp: '15분 전',
      icon: '📏',
    },
    {
      id: 3,
      tool: 'Base64 변환',
      action: '사용',
      timestamp: '1시간 전',
      icon: '🔐',
    },
    {
      id: 4,
      tool: '타임스탬프 변환',
      action: '사용',
      timestamp: '2시간 전',
      icon: '⏰',
    },
  ];

  const stats = [
    {
      title: '총 사용 횟수',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Activity,
      color: 'bg-blue-500',
    },
    {
      title: '사용한 도구',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Wrench,
      color: 'bg-green-500',
    },
    {
      title: '즐겨찾기',
      value: '5',
      change: '+1',
      changeType: 'positive',
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      title: '이번 주 사용',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  const timeRangeOptions = [
    { value: '7d', label: '7일' },
    { value: '30d', label: '30일' },
    { value: '90d', label: '90일' },
    { value: '1y', label: '1년' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            대시보드
          </h1>
          <p className="text-gray-600">
            도구 사용 현황과 통계를 한눈에 확인하세요
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Usage Over Time */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                시간별 사용량
              </h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input-field w-auto"
              >
                {timeRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
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

          {/* Tool Usage Distribution */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              도구별 사용량
            </h3>
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

        {/* Recent Activity and Popular Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              최근 활동
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.tool} {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tools */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              인기 도구
            </h3>
            <div className="space-y-4">
              {toolUsageData.slice(0, 5).map((tool, index) => (
                <div key={tool.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                         style={{ backgroundColor: tool.color }}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {tool.name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {tool.value}회
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            빠른 액션
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="card hover:shadow-lg transition-all duration-200 text-left group">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Eye className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                사용 이력 보기
              </h4>
              <p className="text-gray-600 text-sm">
                모든 도구 사용 기록을 자세히 확인하세요
              </p>
            </button>

            <button className="card hover:shadow-lg transition-all duration-200 text-left group">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                즐겨찾기 관리
              </h4>
              <p className="text-gray-600 text-sm">
                자주 사용하는 도구를 즐겨찾기에 추가하세요
              </p>
            </button>

            <button className="card hover:shadow-lg transition-all duration-200 text-left group">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                데이터 내보내기
              </h4>
              <p className="text-gray-600 text-sm">
                사용 통계를 CSV로 다운로드하세요
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
