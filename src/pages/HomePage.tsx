import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, BarChart3, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  const featuredTools = [
    {
      id: 'unit-converter',
      name: '단위 변환',
      description: '길이, 무게, 온도 등 다양한 단위를 변환할 수 있습니다.',
      icon: Zap,
      color: 'bg-blue-500',
    },
    {
      id: 'json-formatter',
      name: 'JSON 포맷터',
      description: 'JSON 데이터를 보기 좋게 포맷팅하고 압축할 수 있습니다.',
      icon: BarChart3,
      color: 'bg-green-500',
    },
    {
      id: 'base64-converter',
      name: 'Base64 변환',
      description: '텍스트와 Base64 인코딩을 상호 변환할 수 있습니다.',
      icon: Shield,
      color: 'bg-purple-500',
    },
    {
      id: 'timestamp-converter',
      name: '타임스탬프 변환',
      description: 'Unix 타임스탬프와 날짜를 상호 변환할 수 있습니다.',
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  const features = [
    {
      title: '간편한 사용',
      description: '직관적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.',
      icon: Zap,
    },
    {
      title: '빠른 처리',
      description: '클라이언트 사이드에서 즉시 처리되어 빠른 결과를 제공합니다.',
      icon: Zap,
    },
    {
      title: '사용 이력',
      description: '로그인하면 도구 사용 이력을 확인할 수 있습니다.',
      icon: BarChart3,
    },
    {
      title: '지속 업데이트',
      description: '새로운 도구들이 계속해서 추가됩니다.',
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            웹 유틸리티의
            <span className="text-primary-600 block">모든 것</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            개발자와 일반 사용자를 위한 다양한 변환/도구 기능을 제공합니다.
            단위 변환부터 JSON 포맷터까지, 필요한 모든 도구가 여기에 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tools"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <span>도구 둘러보기</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="btn-secondary text-lg px-8 py-3"
            >
              로그인하여 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              인기 도구
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              가장 많이 사용되는 도구들을 먼저 체험해보세요
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
              왜 바리바리인가요?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              사용자 경험을 최우선으로 생각하는 서비스입니다
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
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            다양한 도구들을 무료로 사용하고, 로그인하여 사용 이력을 확인해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/tools"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              모든 도구 보기
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              로그인
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
