import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Copy, Check, RotateCcw, Image, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AsciiArtGeneratorProps {
  className?: string;
}

type CharacterSet = 'ascii' | 'extended' | 'simple' | 'blocks' | 'custom';

const AsciiArtGenerator: React.FC<AsciiArtGeneratorProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [grayscalePreviewUrl, setGrayscalePreviewUrl] = useState<string>('');
  const [asciiResult, setAsciiResult] = useState<string>('');
  const [width, setWidth] = useState(100);
  const [characterSet, setCharacterSet] = useState<CharacterSet>('ascii');
  const [customCharacters, setCustomCharacters] = useState('');
  const [threshold, setThreshold] = useState(128); // 흑백 임계값
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grayscaleCanvasRef = useRef<HTMLCanvasElement>(null);

  // 단순한 문자 세트 (주로 단일 문자 사용)
  const getCharacterSet = (type: CharacterSet): string => {
    switch (type) {
      case 'ascii': return '#';
      case 'extended': return '█';
      case 'simple': return '■';
      case 'blocks': return '▓';
      case 'custom': return customCharacters.trim() || '#'; // 빈 값이면 # 사용
      default: return '#';
    }
  };

  const handleFileChange = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t('tools.ascii_art.invalid_file_type'));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(t('tools.ascii_art.file_too_large'));
      return;
    }

    setSelectedFile(file);
    setError('');
    setLoading(true);

    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Generate grayscale preview and ASCII art
      await processImage(file);
    } catch (err) {
      setError(t('tools.ascii_art.processing_error'));
      console.error('ASCII art generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const processImage = useCallback(async (file: File, char?: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = document.createElement('img');
      const canvas = canvasRef.current;
      const grayscaleCanvas = grayscaleCanvasRef.current;

      if (!canvas || !grayscaleCanvas) {
        reject(new Error('Canvas not available'));
        return;
      }

      // 현재 사용할 문자 결정
      const currentChar = char || getCharacterSet(characterSet);

      img.onload = () => {
        const ctx = canvas.getContext('2d');
        const grayscaleCtx = grayscaleCanvas.getContext('2d');

        if (!ctx || !grayscaleCtx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // 1. 그레이스케일 미리보기 생성
        grayscaleCanvas.width = img.width;
        grayscaleCanvas.height = img.height;
        grayscaleCtx.drawImage(img, 0, 0);

        const grayscaleImageData = grayscaleCtx.getImageData(0, 0, img.width, img.height);
        const grayscalePixels = grayscaleImageData.data;

        // 그레이스케일 변환
        for (let i = 0; i < grayscalePixels.length; i += 4) {
          const r = grayscalePixels[i];
          const g = grayscalePixels[i + 1];
          const b = grayscalePixels[i + 2];
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

          grayscalePixels[i] = gray;
          grayscalePixels[i + 1] = gray;
          grayscalePixels[i + 2] = gray;
        }

        grayscaleCtx.putImageData(grayscaleImageData, 0, 0);
        setGrayscalePreviewUrl(grayscaleCanvas.toDataURL());

        // 2. ASCII 아트 생성
        const aspectRatio = img.height / img.width;
        const outputHeight = Math.floor(width * aspectRatio * 0.5); // 문자 비율 보정

        canvas.width = width;
        canvas.height = outputHeight;
        ctx.drawImage(img, 0, 0, width, outputHeight);

        const imageData = ctx.getImageData(0, 0, width, outputHeight);
        const pixels = imageData.data;

        let ascii = '';

        for (let y = 0; y < outputHeight; y++) {
          for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const r = pixels[offset];
            const g = pixels[offset + 1];
            const b = pixels[offset + 2];

            // 그레이스케일 값 계산
            const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

            // 임계값 기준으로 흑백 결정
            if (gray < threshold) {
              ascii += currentChar; // 어두운 부분은 문자
            } else {
              ascii += ' '; // 밝은 부분은 공백
            }
          }
          ascii += '\n';
        }

        setAsciiResult(ascii);
        resolve();
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, [width, characterSet, threshold, customCharacters]);

  // Auto-regenerate when settings change
  useEffect(() => {
    if (selectedFile) {
      const timeoutId = setTimeout(() => {
        setLoading(true);
        const currentChar = getCharacterSet(characterSet);
        processImage(selectedFile, currentChar)
          .catch(err => {
            setError(t('tools.ascii_art.processing_error'));
            console.error('ASCII art regeneration error:', err);
          })
          .finally(() => setLoading(false));
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [width, characterSet, threshold, customCharacters]);


  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!asciiResult) return;

    try {
      await navigator.clipboard.writeText(asciiResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  // Download as text file
  const downloadAsciiArt = () => {
    if (!asciiResult) return;

    const blob = new Blob([asciiResult], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Reset all states
  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setGrayscalePreviewUrl('');
    setAsciiResult('');
    setError('');
    setCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Image className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('tools.ascii_art.title')}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('tools.ascii_art.description')}
        </p>
      </div>

      {/* File Upload - Compact */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors duration-200 ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-center space-x-4">
            <Upload className="w-6 h-6 text-gray-400" />
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                {t('tools.ascii_art.drag_and_drop')}
              </span>
              <span className="text-gray-600 ml-2">
                {t('tools.ascii_art.or_click_to_browse')}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary text-sm px-4 py-2"
              disabled={loading}
            >
              {t('common.select_file')}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Image Previews - Horizontal Layout */}
      {selectedFile && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Image className="w-4 h-4 mr-2" />
            {t('tools.ascii_art.image_preview')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Image */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {t('tools.ascii_art.original_image')}
              </h3>
              <img
                src={previewUrl}
                alt="Original"
                className="w-full h-auto rounded-lg border border-gray-200"
                style={{ maxHeight: '150px', objectFit: 'contain' }}
              />
            </div>

            {/* Grayscale Preview */}
            {grayscalePreviewUrl && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {t('tools.ascii_art.grayscale_preview')}
                </h3>
                <img
                  src={grayscalePreviewUrl}
                  alt="Grayscale"
                  className="w-full h-auto rounded-lg border border-gray-200"
                  style={{ maxHeight: '150px', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings */}
      {selectedFile && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            {t('tools.ascii_art.settings')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.ascii_art.width')}
              </label>
              <input
                type="range"
                min="50"
                max="200"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-500 mt-1">{width}</div>
            </div>

            {/* Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.ascii_art.threshold')}
              </label>
              <input
                type="range"
                min="0"
                max="255"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-500 mt-1">{threshold}</div>
            </div>

            {/* Character Set */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.ascii_art.character_set')}
              </label>
              <select
                value={characterSet}
                onChange={(e) => setCharacterSet(e.target.value as CharacterSet)}
                className="input-field"
              >
                <option value="ascii"># {t('tools.ascii_art.char_sets.ascii')}</option>
                <option value="extended">█ {t('tools.ascii_art.char_sets.extended')}</option>
                <option value="simple">■ {t('tools.ascii_art.char_sets.simple')}</option>
                <option value="blocks">▓ {t('tools.ascii_art.char_sets.blocks')}</option>
                <option value="custom">{t('tools.ascii_art.char_sets.custom')}</option>
              </select>
            </div>

            {/* Custom Character */}
            {characterSet === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('tools.ascii_art.custom_character')}
                </label>
                <input
                  type="text"
                  value={customCharacters}
                  onChange={(e) => setCustomCharacters(e.target.value)}
                  className="input-field"
                  maxLength={1}
                  placeholder="#"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ASCII Result - Full Width */}
      {selectedFile && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('tools.ascii_art.result')}
            </h2>

            {asciiResult && (
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary flex items-center space-x-2"
                  disabled={!asciiResult}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t('common.copied') : t('common.copy')}</span>
                </button>

                <button
                  onClick={downloadAsciiArt}
                  className="btn-secondary flex items-center space-x-2"
                  disabled={!asciiResult}
                >
                  <Download className="w-4 h-4" />
                  <span>{t('common.download')}</span>
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">{t('tools.ascii_art.processing')}</p>
            </div>
          ) : asciiResult ? (
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-xs overflow-auto" style={{ maxHeight: '600px', minHeight: '400px' }}>
              <pre className="whitespace-pre">{asciiResult}</pre>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t('tools.ascii_art.no_result')}</p>
            </div>
          )}
        </div>
      )}

      {/* Reset Button */}
      {selectedFile && (
        <div className="text-center">
          <button
            onClick={reset}
            className="btn-secondary flex items-center space-x-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('common.reset')}</span>
          </button>
        </div>
      )}

      {/* Hidden Canvases */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <canvas ref={grayscaleCanvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default AsciiArtGenerator;