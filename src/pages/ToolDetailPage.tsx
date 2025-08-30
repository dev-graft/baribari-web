import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Star, Clock, Users } from 'lucide-react';
import Base64Converter from '../components/tools/Base64Converter';

const ToolDetailPage: React.FC = () => {
  const { toolId } = useParams();
  const [copied, setCopied] = React.useState(false);

  // 실제로는 API에서 도구 정보를 가져와야 합니다
  const tool = {
    id: toolId,
    name: 'Base64 변환기',
    description: '문자열과 Base64 간의 상호 변환을 지원하는 도구입니다. 텍스트 인코딩/디코딩, 클립보드 복사, 입출력 바꾸기 등의 기능을 제공합니다.',
    icon: '🔐',
    category: '인코딩/디코딩',
    tags: ['Base64', '인코딩', '디코딩', '텍스트 변환'],
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



        {/* Base64 Converter Tool */}
        <Base64Converter />

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
