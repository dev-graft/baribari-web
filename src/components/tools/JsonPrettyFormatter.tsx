import React, { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface JsonPrettyFormatterProps {
  className?: string;
}

const JsonPrettyFormatter: React.FC<JsonPrettyFormatterProps> = ({ className = '' }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
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
      // JSON 문자열을 파싱하고 포맷팅
      const parsedJson = JSON.parse(value);
      const prettyJson = JSON.stringify(parsedJson, null, 2);
      setOutputText(prettyJson);
    } catch (err) {
      setError('유효하지 않은 JSON 형식입니다. JSON 구문을 확인해주세요.');
      setOutputText('');
    }
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

  const formatJson = (json: string, indent: number = 2) => {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, indent);
    } catch (err) {
      return json;
    }
  };

  const handleIndentChange = (indent: number) => {
    if (inputText.trim() && !error) {
      try {
        const parsedJson = JSON.parse(inputText);
        const prettyJson = JSON.stringify(parsedJson, null, indent);
        setOutputText(prettyJson);
      } catch (err) {
        // 이미 에러 상태이므로 아무것도 하지 않음
      }
    }
  };

  const minifyJson = () => {
    if (inputText.trim() && !error) {
      try {
        const parsedJson = JSON.parse(inputText);
        const minifiedJson = JSON.stringify(parsedJson);
        setOutputText(minifiedJson);
      } catch (err) {
        // 이미 에러 상태이므로 아무것도 하지 않음
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">JSON Pretty Formatter</h2>
          <p className="text-gray-600">
            JSON 문자열을 읽기 쉽게 포맷팅하거나 압축합니다
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClear}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="모두 지우기"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Formatting Options */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">포맷팅 옵션:</span>
        <button
          onClick={() => handleIndentChange(2)}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          disabled={!inputText.trim() || !!error}
        >
          들여쓰기 2
        </button>
        <button
          onClick={() => handleIndentChange(4)}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          disabled={!inputText.trim() || !!error}
        >
          들여쓰기 4
        </button>
        <button
          onClick={minifyJson}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          disabled={!inputText.trim() || !!error}
        >
          압축
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            입력 JSON
          </label>
          <div className="relative">
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder="포맷팅할 JSON 문자열을 입력하세요..."
              className="w-full h-80 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
            />
            {inputText && (
              <button
                onClick={() => handleCopy(inputText)}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="입력 JSON 복사"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            포맷된 JSON
          </label>
          <div className="relative">
            <textarea
              value={error ? '' : outputText}
              readOnly
              placeholder="포맷된 JSON이 여기에 표시됩니다"
              className={`w-full h-80 px-4 py-3 border rounded-lg resize-none font-mono text-sm ${
                error
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-gray-50 text-gray-900'
              }`}
            />
            {outputText && !error && (
              <button
                onClick={() => handleCopy(outputText)}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors shadow-sm"
                title="포맷된 JSON 복사"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-6xl mb-4">❌</div>
                  <div className="text-red-700 font-medium mb-2">JSON 파싱 오류</div>
                  <div className="text-red-600 text-sm">{error}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      {outputText && !error && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-blue-900 text-sm font-medium">원본 길이</div>
            <div className="text-blue-800 text-lg font-bold">{inputText.length}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-green-900 text-sm font-medium">포맷된 길이</div>
            <div className="text-green-800 text-lg font-bold">{outputText.length}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-purple-900 text-sm font-medium">원본 줄 수</div>
            <div className="text-purple-800 text-lg font-bold">{inputText.split('\n').length}</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-orange-900 text-sm font-medium">포맷된 줄 수</div>
            <div className="text-orange-800 text-lg font-bold">{outputText.split('\n').length}</div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">사용법</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>자동 포맷팅:</strong> JSON을 입력하면 자동으로 읽기 쉽게 포맷팅됩니다</li>
          <li>• <strong>들여쓰기 조정:</strong> 2칸 또는 4칸 들여쓰기를 선택할 수 있습니다</li>
          <li>• <strong>압축:</strong> 포맷된 JSON을 한 줄로 압축할 수 있습니다</li>
          <li>• <strong>복사:</strong> 우상단 버튼으로 포맷된 결과를 클립보드에 복사할 수 있습니다</li>
          <li>• <strong>오류 검증:</strong> 잘못된 JSON 형식일 경우 오류 메시지가 표시됩니다</li>
        </ul>
      </div>
    </div>
  );
};

export default JsonPrettyFormatter;
