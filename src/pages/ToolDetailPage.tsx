import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Base64Converter from '../components/tools/Base64Converter';
import JsonPrettyFormatter from '../components/tools/JsonPrettyFormatter';
import UrlEncoder from '../components/tools/UrlEncoder';
import QRCodeGenerator from '../components/tools/QRCodeGenerator';
import StringDiff from '../components/tools/StringDiff';
import SlackEmojiGenerator from '../components/tools/SlackEmojiGenerator';
import AsciiArtGenerator from '../components/tools/AsciiArtGenerator';

const ToolDetailPage: React.FC = () => {
  const { toolId } = useParams();
  const { t } = useTranslation();

  const isBase64Converter = toolId === 'base64-converter';
  const isJsonPrettyFormatter = toolId === 'json-formatter';
  const isUrlEncoder = toolId === 'url-encoder';
  const isQRCodeGenerator = toolId === 'qr-code-generator';
  const isStringDiff = toolId === 'string-diff';
  const isSlackEmojiGenerator = toolId === 'slack-emoji-generator';
  const isAsciiArtGenerator = toolId === 'ascii-art-generator';

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
            <span>{t('common.back_to_list')}</span>
          </Link>
        </div>

        {/* Tool Content */}
        {isBase64Converter ? (
          <Base64Converter />
        ) : isJsonPrettyFormatter ? (
          <JsonPrettyFormatter />
        ) : isUrlEncoder ? (
          <UrlEncoder />
        ) : isQRCodeGenerator ? (
          <QRCodeGenerator />
        ) : isStringDiff ? (
          <StringDiff />
        ) : isSlackEmojiGenerator ? (
          <SlackEmojiGenerator />
        ) : isAsciiArtGenerator ? (
          <AsciiArtGenerator />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚧</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('common.tool_in_development_title')}
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {t('common.tool_in_development_desc')}
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-yellow-800">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-medium">{t('common.development_in_progress')}</span>
                </div>
                <p className="text-yellow-700 text-sm mt-2">
                  {t('common.tool_coming_soon')}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <p>{t('common.want_notification')}</p>
                <p className="mt-1">
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    {t('common.apply_for_notification')}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Related Tools */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('common.related_tools')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for related tools */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="card hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('common.related_tool')} {i}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t('common.related_tool_desc')}
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