import React, { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface JsonPrettyFormatterProps {
  className?: string;
}

const JsonPrettyFormatter: React.FC<JsonPrettyFormatterProps> = ({ className = '' }) => {
  const { t } = useTranslation();
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
      const parsedJson = JSON.parse(value);
      const prettyJson = JSON.stringify(parsedJson, null, 2);
      setOutputText(prettyJson);
    } catch (err) {
      setError(t('tools.json_formatter.parse_error_message'));
      setOutputText('');
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(t('tools.json_formatter.copy_error'), err);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  const handleIndentChange = (indent: number) => {
    if (inputText.trim() && !error) {
      try {
        const parsedJson = JSON.parse(inputText);
        const prettyJson = JSON.stringify(parsedJson, null, indent);
        setOutputText(prettyJson);
      } catch (err) {
        // Already in error state, do nothing
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
        // Already in error state, do nothing
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.json_formatter.title')}</h2>
          <p className="text-gray-600">
            {t('tools.json_formatter.description')}
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

      {/* Formatting Options */}
      <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">{t('tools.json_formatter.options_label')}:</span>
        <button
          onClick={() => handleIndentChange(2)}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          disabled={!inputText.trim() || !!error}
        >
          {t('tools.json_formatter.indent_2')}
        </button>
        <button
          onClick={() => handleIndentChange(4)}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          disabled={!inputText.trim() || !!error}
        >
          {t('tools.json_formatter.indent_4')}
        </button>
        <button
          onClick={minifyJson}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          disabled={!inputText.trim() || !!error}
        >
          {t('tools.json_formatter.minify')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('tools.json_formatter.input_label')}
          </label>
          <div className="relative">
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder={t('tools.json_formatter.input_placeholder')}
              className="w-full h-80 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none font-mono text-sm"
            />
            {inputText && (
              <button
                onClick={() => handleCopy(inputText)}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('tools.json_formatter.copy_input')}
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Output Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('tools.json_formatter.output_label')}
          </label>
          <div className="relative">
            <textarea
              value={error ? '' : outputText}
              readOnly
              placeholder={t('tools.json_formatter.output_placeholder')}
              className={`w-full h-80 px-4 py-3 border rounded-lg resize-none font-mono text-sm ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 text-gray-900'}`}
            />
            {outputText && !error && (
              <button
                onClick={() => handleCopy(outputText)}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors shadow-sm"
                title={t('tools.json_formatter.copy_output')}
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="text-6xl mb-4">❌</div>
                  <div className="text-red-700 font-medium mb-2">{t('tools.json_formatter.parse_error_title')}</div>
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
            <div className="text-blue-900 text-sm font-medium">{t('tools.json_formatter.stats.original_length')}</div>
            <div className="text-blue-800 text-lg font-bold">{inputText.length}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-green-900 text-sm font-medium">{t('tools.json_formatter.stats.formatted_length')}</div>
            <div className="text-green-800 text-lg font-bold">{outputText.length}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-purple-900 text-sm font-medium">{t('tools.json_formatter.stats.original_lines')}</div>
            <div className="text-purple-800 text-lg font-bold">{inputText.split('\n').length}</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-orange-900 text-sm font-medium">{t('tools.json_formatter.stats.formatted_lines')}</div>
            <div className="text-orange-800 text-lg font-bold">{outputText.split('\n').length}</div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">{t('common.how_to_use')}</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>{t('tools.json_formatter.usage.item1')}:</strong> {t('tools.json_formatter.usage.item1_desc')}</li>
          <li>• <strong>{t('tools.json_formatter.usage.item2')}:</strong> {t('tools.json_formatter.usage.item2_desc')}</li>
          <li>• <strong>{t('tools.json_formatter.usage.item3')}:</strong> {t('tools.json_formatter.usage.item3_desc')}</li>
          <li>• <strong>{t('common.save')}:</strong> {t('tools.json_formatter.usage.item4_desc')}</li>
          <li>• <strong>{t('tools.json_formatter.usage.item5')}:</strong> {t('tools.json_formatter.usage.item5_desc')}</li>
        </ul>
      </div>
    </div>
  );
};

export default JsonPrettyFormatter;