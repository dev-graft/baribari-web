import React, { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Base64ConverterProps {
  className?: string;
}

const Base64Converter: React.FC<Base64ConverterProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);
    setError('');
    
    if (value.trim() === '') {
      setOutputText('');
      return;
    }

    try {
      if (mode === 'encode') {
        // 문자열을 Base64로 인코딩
        const encoded = btoa(unescape(encodeURIComponent(value)));
        setOutputText(encoded);
      } else {
        // Base64를 문자열로 디코딩
        const decoded = decodeURIComponent(escape(atob(value)));
        setOutputText(decoded);
      }
    } catch (err) {
      if (mode === 'decode') {
        setError('유효하지 않은 Base64 문자열입니다.');
        setOutputText('');
      }
    }
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
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
      setInputText(outputText);
      setOutputText('');
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.base64.title')}</h2>
          <p className="text-gray-600">
            {t('tools.base64.description')}
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

      {/* Mode Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => handleModeChange('encode')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            mode === 'encode'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('tools.base64.encode')}
        </button>
        <button
          onClick={() => handleModeChange('decode')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            mode === 'decode'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('tools.base64.decode')}
        </button>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'encode' ? t('tools.base64.input_placeholder') : 'Base64'}
        </label>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder={t('tools.base64.input_placeholder')}
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
          {mode === 'encode' ? 'Base64' : t('tools.base64.output_placeholder')}
        </label>
        <div className="relative">
          <textarea
            value={outputText}
            readOnly
            placeholder={t('tools.base64.output_placeholder')}
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
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">사용법</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>인코딩:</strong> 일반 텍스트를 Base64로 변환합니다</li>
          <li>• <strong>디코딩:</strong> Base64 문자열을 원본 텍스트로 변환합니다</li>
          <li>• <strong>입출력 바꾸기:</strong> 변환된 결과를 새로운 입력으로 사용할 수 있습니다</li>
          <li>• <strong>복사:</strong> 각 텍스트 영역의 우상단 버튼으로 내용을 복사할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
};

export default Base64Converter;
