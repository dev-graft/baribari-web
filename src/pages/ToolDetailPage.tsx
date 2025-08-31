import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Base64Converter from '../components/tools/Base64Converter';
import JsonPrettyFormatter from '../components/tools/JsonPrettyFormatter';

const ToolDetailPage: React.FC = () => {
  const { toolId } = useParams();

  const isBase64Converter = toolId === 'base64-converter';
  const isJsonPrettyFormatter = toolId === 'json-pretty-formatter';

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



        {/* Tool Content */}
        {isBase64Converter ? (
          <Base64Converter />
        ) : isJsonPrettyFormatter ? (
          <JsonPrettyFormatter />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚧</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                개발 준비 중인 도구
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                이 도구는 현재 개발 준비 중입니다.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-yellow-800">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-medium">개발 진행 중</span>
                </div>
                <p className="text-yellow-700 text-sm mt-2">
                  이 도구는 현재 개발 중입니다. 곧 사용할 수 있게 됩니다.
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <p>개발이 완료되면 알림을 받고 싶으시다면</p>
                <p className="mt-1">
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    알림 신청하기
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

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
