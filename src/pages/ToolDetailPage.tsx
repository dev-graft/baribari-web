import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Star, Clock, Users } from 'lucide-react';

const ToolDetailPage: React.FC = () => {
  const { toolId } = useParams();
  const [copied, setCopied] = React.useState(false);

  // 실제로는 API에서 도구 정보를 가져와야 합니다
  const tool = {
    id: toolId,
    name: '도구 이름',
    description: '도구에 대한 자세한 설명입니다.',
    icon: '🔧',
    category: '유틸리티',
    tags: ['태그1', '태그2'],
    usageCount: 1234,
    rating: 4.5,
    lastUpdated: '2024-01-15',
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/tools"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>도구 목록으로 돌아가기</span>
          </Link>
        </div>

        {/* Tool Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-3xl">
                {tool.icon}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {tool.name}
                </h1>
                <p className="text-gray-600 text-lg">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>

          {/* Tool Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {tool.usageCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">사용 횟수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {tool.rating}
              </div>
              <div className="text-sm text-gray-600">평점</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {tool.category}
              </div>
              <div className="text-sm text-gray-600">카테고리</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {tool.lastUpdated}
              </div>
              <div className="text-sm text-gray-600">최근 업데이트</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tool Content */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            도구 사용하기
          </h2>
          <p className="text-gray-600 mb-6">
            이 도구는 현재 개발 중입니다. 곧 사용할 수 있게 됩니다.
          </p>
          
          {/* Placeholder for actual tool */}
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚧</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              개발 진행 중
            </h3>
            <p className="text-gray-600">
              이 도구는 현재 개발 중입니다. 곧 사용할 수 있게 됩니다.
            </p>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            관련 도구
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for related tools */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="card hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  관련 도구 {i}
                </h3>
                <p className="text-gray-600 text-sm">
                  이 도구와 관련된 유용한 도구입니다.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
