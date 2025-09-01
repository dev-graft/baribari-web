import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, Code, Calculator, Clock, FileText, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ToolsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: t('tools.categories.all'), icon: Zap },
    { id: 'converter', name: t('tools.categories.converter'), icon: Calculator },
    { id: 'formatter', name: t('tools.categories.formatter'), icon: Code },
    { id: 'utility', name: t('tools.categories.utility'), icon: FileText },
    { id: 'time', name: t('tools.categories.time'), icon: Clock },
    { id: 'security', name: t('tools.categories.security'), icon: Shield },
  ];

  const tools = [
    {
      id: 'unit-converter',
      name: t('tools.tools_list.unit_converter.name'),
      description: t('tools.tools_list.unit_converter.description'),
      category: 'converter',
      icon: Calculator,
      color: 'bg-blue-500',
      tags: ['단위', '변환', '계산'],
    },
    {
      id: 'json-pretty-formatter',
      name: t('tools.tools_list.json_formatter.name'),
      description: t('tools.tools_list.json_formatter.description'),
      category: 'formatter',
      icon: Code,
      color: 'bg-green-500',
      tags: ['JSON', '포맷팅', '코드'],
    },
    {
      id: 'base64-converter',
      name: t('tools.tools_list.base64_converter.name'),
      description: t('tools.tools_list.base64_converter.description'),
      category: 'security',
      icon: Shield,
      color: 'bg-purple-500',
      tags: ['Base64', '인코딩', '보안'],
    },
    {
      id: 'timestamp-converter',
      name: t('tools.tools_list.timestamp_converter.name'),
      description: t('tools.tools_list.timestamp_converter.description'),
      category: 'time',
      icon: Clock,
      color: 'bg-orange-500',
      tags: ['타임스탬프', '날짜', '시간'],
    },
    {
      id: 'url-encoder',
      name: t('tools.tools_list.url_encoder.name'),
      description: t('tools.tools_list.url_encoder.description'),
      category: 'utility',
      icon: FileText,
      color: 'bg-red-500',
      tags: [t('tools.tags.url'), t('tools.tags.encoding'), t('tools.tags.web')],
    },
    {
      id: 'cron-parser',
      name: t('tools.tools_list.cron_parser.name'),
      description: t('tools.tools_list.cron_parser.description'),
      category: 'time',
      icon: Clock,
      color: 'bg-indigo-500',
      tags: [t('tools.tags.cron'), t('tools.tags.schedule'), t('tools.tags.time')],
    },
    {
      id: 'color-converter',
      name: t('tools.tools_list.color_converter.name'),
      description: t('tools.tools_list.color_converter.description'),
      category: 'converter',
      icon: Calculator,
      color: 'bg-pink-500',
      tags: [t('tools.tags.color'), t('tools.tags.hex'), t('tools.tags.rgb')],
    },
    {
      id: 'text-case-converter',
      name: t('tools.tools_list.text_case_converter.name'),
      description: t('tools.tools_list.text_case_converter.description'),
      category: 'formatter',
      icon: Code,
      color: 'bg-teal-500',
      tags: [t('tools.tags.text'), t('tools.tags.case'), t('tools.tags.formatting')],
    },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('tools.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('tools.description')}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('tools.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.id}`}
                className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('common.no_results')}
            </h3>
            <p className="text-gray-600">
              {t('common.try_other_keyword')}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {tools.length}+
              </div>
              <div className="text-gray-600">{t('tools.stats.available_tools')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600">{t('tools.stats.tool_categories')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {t('common.free')}
              </div>
              <div className="text-gray-600">{t('tools.stats.all_free')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
