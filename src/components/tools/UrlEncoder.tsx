import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Link, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UrlEncoderProps {
  className?: string;
}

type ActionMode = 'encode' | 'decode';

const UrlEncoder: React.FC<UrlEncoderProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [actionMode, setActionMode] = useState<ActionMode>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // URL encoding/decoding functions
  const encodeUrl = (text: string): string => {
    try {
      return encodeURIComponent(text);
    } catch (err) {
      throw new Error(t('tools.url_encoder.encode_error'));
    }
  };

  const decodeUrl = (text: string): string => {
    try {
      return decodeURIComponent(text);
    } catch (err) {
      throw new Error(t('tools.url_encoder.decode_error'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);
    setError('');
    
    if (value.trim() === '') {
      setOutputText('');
      return;
    }

    try {
      if (actionMode === 'encode') {
        const encoded = encodeUrl(value);
        setOutputText(encoded);
      } else {
        const decoded = decodeUrl(value);
        setOutputText(decoded);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.url_encoder.general_error'));
      setOutputText('');
    }
  };

  const handleActionModeChange = (newMode: ActionMode) => {
    setActionMode(newMode);
    setInputText('');
    setOutputText('');
    setError('');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const handleSwap = () => {
    if (outputText && !error) {
      const newInputText = outputText;
      const newActionMode = actionMode === 'encode' ? 'decode' : 'encode';
      
      setInputText(newInputText);
      setActionMode(newActionMode);
      
      // 즉시 새로운 모드로 변환 처리
      try {
        if (newActionMode === 'encode') {
          const encoded = encodeUrl(newInputText);
          setOutputText(encoded);
        } else {
          const decoded = decodeUrl(newInputText);
          setOutputText(decoded);
        }
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : t('tools.url_encoder.general_error'));
        setOutputText('');
      }
    }
  };

  const handleUrlValidation = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const getUrlPreview = (url: string) => {
    if (actionMode === 'decode' && handleUrlValidation(url)) {
      return (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">{t('tools.url_encoder.valid_url')}</span>
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-green-700 hover:text-green-800 underline break-all"
          >
            {url}
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.url_encoder.title')}</h2>
          <p className="text-gray-600">
            {t('tools.url_encoder.description')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClear}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('common.delete')}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Action Mode Toggle */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => handleActionModeChange('encode')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center space-x-2 ${
              actionMode === 'encode'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>{t('tools.url_encoder.encode')}</span>
          </button>
          <button
            onClick={() => handleActionModeChange('decode')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center space-x-2 ${
              actionMode === 'decode'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{t('tools.url_encoder.decode')}</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {actionMode === 'encode' ? t('common.input_text') : t('tools.url_encoder.encoded_url')}
        </label>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder={actionMode === 'encode' ? t('tools.url_encoder.input_placeholder') : t('tools.url_encoder.decode_placeholder')}
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          {inputText && (
            <button
              onClick={() => handleCopy(inputText)}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={t('common.save')}
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Swap Button */}
      {outputText && !error && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSwap}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('common.update')}</span>
          </button>
        </div>
      )}

      {/* Output Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {actionMode === 'encode' ? t('tools.url_encoder.encoded_result') : t('common.output_text')}
        </label>
        <div className="relative">
          <textarea
            value={outputText}
            readOnly
            placeholder={t('tools.url_encoder.output_placeholder')}
            className={`w-full h-32 px-4 py-3 border rounded-lg resize-none ${
              error
                ? 'border-red-300 bg-red-50 text-red-700'
                : 'border-gray-300 bg-gray-50 text-gray-900'
            }`}
          />
          {outputText && !error && (
            <button
              onClick={() => handleCopy(outputText)}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={t('common.save')}
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}

        {/* URL Preview for decoded URLs */}
        {outputText && !error && actionMode === 'decode' && getUrlPreview(outputText)}
      </div>

      {/* Statistics */}
      {outputText && !error && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-blue-900 text-sm font-medium">{t('tools.url_encoder.stats.original_length')}</div>
            <div className="text-blue-800 text-lg font-bold">{inputText.length}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-green-900 text-sm font-medium">{t('tools.url_encoder.stats.encoded_length')}</div>
            <div className="text-green-800 text-lg font-bold">{outputText.length}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-purple-900 text-sm font-medium">{t('tools.url_encoder.stats.ratio')}</div>
            <div className="text-purple-800 text-lg font-bold">
              {inputText.length > 0 ? Math.round((outputText.length / inputText.length) * 100) : 0}%
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-orange-900 text-sm font-medium">{t('tools.url_encoder.stats.difference')}</div>
            <div className="text-orange-800 text-lg font-bold">
              {outputText.length - inputText.length > 0 ? '+' : ''}{outputText.length - inputText.length}
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">{t('common.how_to_use')}</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>{t('tools.url_encoder.encode')}:</strong> {t('tools.url_encoder.usage.item1')}</li>
          <li>• <strong>{t('tools.url_encoder.decode')}:</strong> {t('tools.url_encoder.usage.item2')}</li>
          <li>• <strong>{t('common.update')}:</strong> {t('tools.url_encoder.usage.item3')}</li>
          <li>• <strong>{t('common.save')}:</strong> {t('tools.url_encoder.usage.item4')}</li>
          <li>• <strong>{t('tools.url_encoder.usage.item5')}:</strong> {t('tools.url_encoder.usage.item5_desc')}</li>
        </ul>
      </div>
    </div>
  );
};

export default UrlEncoder;
