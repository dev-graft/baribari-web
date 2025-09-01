import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, BarChart3, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const featuredTools = [
    {
      id: 'unit-converter',
      name: t('tools.tools_list.unit_converter.name'),
      description: t('tools.tools_list.unit_converter.description'),
      icon: Zap,
      color: 'bg-blue-500',
    },
    {
      id: 'json-formatter',
      name: t('tools.tools_list.json_formatter.name'),
      description: t('tools.tools_list.json_formatter.description'),
      icon: BarChart3,
      color: 'bg-green-500',
    },
    {
      id: 'base64-converter',
      name: t('tools.tools_list.base64_converter.name'),
      description: t('tools.tools_list.base64_converter.description'),
      icon: Shield,
      color: 'bg-purple-500',
    },
    {
      id: 'timestamp-converter',
      name: t('tools.tools_list.timestamp_converter.name'),
      description: t('tools.tools_list.timestamp_converter.description'),
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  const features = [
    {
      title: t('home.features.easy_to_use.title'),
      description: t('home.features.easy_to_use.description'),
      icon: Zap,
    },
    {
      title: t('home.features.fast_processing.title'),
      description: t('home.features.fast_processing.description'),
      icon: Zap,
    },
    {
      title: t('home.features.usage_history.title'),
      description: t('home.features.usage_history.description'),
      icon: BarChart3,
    },
    {
      title: t('home.features.continuous_updates.title'),
      description: t('home.features.continuous_updates.description'),
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('home.hero.title_part1')}
            <span className="text-primary-600 block">{t('home.hero.title_part2')}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('home.hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tools"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <span>{t('home.hero.browse_tools')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="btn-secondary text-lg px-8 py-3"
            >
              {t('home.hero.login_to_start')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featured_tools.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.featured_tools.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool) => (
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
                <p className="text-gray-600 text-sm">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.why_us.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('home.why_us.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {t('home.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tools"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              {t('home.cta.view_all_tools')}
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              {t('common.login')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;