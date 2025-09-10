import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StringDiffProps {
  className?: string;
}

interface DiffResult {
  type: 'equal' | 'added' | 'removed';
  value: string;
}

const StringDiff: React.FC<StringDiffProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [copied, setCopied] = useState(false);
  const [diffMode, setDiffMode] = useState<'character' | 'word' | 'line'>('word');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  const computeDiff = (oldText: string, newText: string): DiffResult[] => {
    let a = oldText;
    let b = newText;

    if (ignoreCase) {
      a = a.toLowerCase();
      b = b.toLowerCase();
    }

    if (ignoreWhitespace) {
      a = a.replace(/\s+/g, ' ').trim();
      b = b.replace(/\s+/g, ' ').trim();
    }

    let tokensA: string[];
    let tokensB: string[];

    if (diffMode === 'character') {
      tokensA = a.split('');
      tokensB = b.split('');
    } else if (diffMode === 'word') {
      tokensA = a.split(/(\s+)/);
      tokensB = b.split(/(\s+)/);
    } else {
      tokensA = a.split('\n');
      tokensB = b.split('\n');
    }

    const dp: number[][] = Array(tokensA.length + 1)
      .fill(null)
      .map(() => Array(tokensB.length + 1).fill(0));

    for (let i = 1; i <= tokensA.length; i++) {
      for (let j = 1; j <= tokensB.length; j++) {
        if (tokensA[i - 1] === tokensB[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const result: DiffResult[] = [];
    let i = tokensA.length;
    let j = tokensB.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && tokensA[i - 1] === tokensB[j - 1]) {
        result.unshift({ type: 'equal', value: tokensA[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({ type: 'added', value: tokensB[j - 1] });
        j--;
      } else if (i > 0) {
        result.unshift({ type: 'removed', value: tokensA[i - 1] });
        i--;
      }
    }

    return result;
  };

  const diffResult = useMemo(() => {
    if (!textA && !textB) return [];
    return computeDiff(textA, textB);
  }, [textA, textB, diffMode, ignoreWhitespace, ignoreCase]);

  const stats = useMemo(() => {
    const added = diffResult.filter(d => d.type === 'added').length;
    const removed = diffResult.filter(d => d.type === 'removed').length;
    const equal = diffResult.filter(d => d.type === 'equal').length;
    
    return { added, removed, equal, total: added + removed + equal };
  }, [diffResult]);

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
    setTextA('');
    setTextB('');
  };

  const handleSwap = () => {
    const temp = textA;
    setTextA(textB);
    setTextB(temp);
  };

  const renderDiffResult = () => {
    if (diffResult.length === 0) {
      return (
        <div className="text-gray-500 text-center py-8">
          {t('tools.string_diff.no_diff')}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {diffResult.map((item, index) => {
          let className = 'inline';
          let displayValue = item.value;

          if (diffMode === 'line' && item.value !== '') {
            className = 'block px-2 py-1 rounded';
          }

          if (item.type === 'added') {
            className += ' bg-green-100 text-green-800';
            if (diffMode !== 'line') displayValue = `+${item.value}`;
          } else if (item.type === 'removed') {
            className += ' bg-red-100 text-red-800 line-through';
            if (diffMode !== 'line') displayValue = `-${item.value}`;
          } else {
            className += ' text-gray-700';
          }

          return (
            <span key={index} className={className}>
              {displayValue}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.string_diff.title')}</h2>
          <p className="text-gray-600">
            {t('tools.string_diff.description')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSwap}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('tools.string_diff.swap')}
            disabled={!textA && !textB}
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('common.delete')}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="mb-6 space-y-4">
        {/* Diff Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('tools.string_diff.diff_mode')}
          </label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDiffMode('character')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                diffMode === 'character'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('tools.string_diff.character')}
            </button>
            <button
              onClick={() => setDiffMode('word')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                diffMode === 'word'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('tools.string_diff.word')}
            </button>
            <button
              onClick={() => setDiffMode('line')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                diffMode === 'line'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('tools.string_diff.line')}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">{t('tools.string_diff.ignore_whitespace')}</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">{t('tools.string_diff.ignore_case')}</span>
          </label>
        </div>
      </div>

      {/* Input Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Text A */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('tools.string_diff.text_a')}
          </label>
          <div className="relative">
            <textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder={t('tools.string_diff.text_a_placeholder')}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            {textA && (
              <button
                onClick={() => handleCopy(textA)}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('common.save')}
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Text B */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('tools.string_diff.text_b')}
          </label>
          <div className="relative">
            <textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder={t('tools.string_diff.text_b_placeholder')}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            {textB && (
              <button
                onClick={() => handleCopy(textB)}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('common.save')}
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {(textA || textB) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900">{stats.equal}</div>
            <div className="text-sm text-gray-600">{t('tools.string_diff.equal')}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{stats.added}</div>
            <div className="text-sm text-green-600">{t('tools.string_diff.added')}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-600">{stats.removed}</div>
            <div className="text-sm text-red-600">{t('tools.string_diff.removed')}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-600">{t('tools.string_diff.total')}</div>
          </div>
        </div>
      )}

      {/* Result Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('tools.string_diff.result')}
        </label>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-32 max-h-96 overflow-y-auto">
          {renderDiffResult()}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">{t('common.how_to_use')}</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>{t('tools.string_diff.input')}:</strong> {t('tools.string_diff.usage.item1')}</li>
          <li>• <strong>{t('tools.string_diff.diff_mode')}:</strong> {t('tools.string_diff.usage.item2')}</li>
          <li>• <strong>{t('tools.string_diff.options')}:</strong> {t('tools.string_diff.usage.item3')}</li>
          <li>• <strong>{t('tools.string_diff.colors')}:</strong> {t('tools.string_diff.usage.item4')}</li>
          <li>• <strong>{t('tools.string_diff.swap')}:</strong> {t('tools.string_diff.usage.item5')}</li>
        </ul>
      </div>
    </div>
  );
};

export default StringDiff;