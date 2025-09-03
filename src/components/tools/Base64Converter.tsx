import React, { useState, useRef } from 'react';
import { Copy, Check, RotateCcw, Upload, Type } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Base64ConverterProps {
  className?: string;
}

type ConversionMode = 'text' | 'file';
type ActionMode = 'encode' | 'decode';
type Base64Variant = 'standard' | 'urlsafe';

const Base64Converter: React.FC<Base64ConverterProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [conversionMode, setConversionMode] = useState<ConversionMode>('text');
  const [actionMode, setActionMode] = useState<ActionMode>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [base64Variant, setBase64Variant] = useState<Base64Variant>('standard');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isImage, setIsImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Base64 encoding/decoding functions
  const encodeBase64 = (text: string, variant: Base64Variant = 'standard'): string => {
    const encoded = btoa(unescape(encodeURIComponent(text)));
    if (variant === 'urlsafe') {
      return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    return encoded;
  };

  const decodeBase64 = (text: string, variant: Base64Variant = 'standard'): string => {
    let base64Text = text;
    if (variant === 'urlsafe') {
      // Convert URL-safe back to standard Base64
      base64Text = text.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      while (base64Text.length % 4) {
        base64Text += '=';
      }
    }
    return decodeURIComponent(escape(atob(base64Text)));
  };

  // File handling functions
  const handleFileChange = async (file: File) => {
    if (!file) return;
    
    if (conversionMode === 'file' && actionMode === 'encode') {
      setLoading(true);
      setError('');
      
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            const base64 = result.split(',')[1]; // Remove data:mime;base64, prefix
            const mimeType = file.type || 'application/octet-stream';
            const dataUri = `data:${mimeType};base64,${base64}`;
            setOutputText(dataUri);
          }
          setLoading(false);
        };
        reader.onerror = () => {
          setError(t('tools.base64.file_read_error'));
          setLoading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError(t('tools.base64.file_read_error'));
        setLoading(false);
      }
    }
  };


  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);
    setError('');
    
    if (value.trim() === '') {
      setOutputText('');
      return;
    }

    try {
      if (actionMode === 'encode') {
        const encoded = encodeBase64(value, base64Variant);
        setOutputText(encoded);
      } else {
        const decoded = decodeBase64(value, base64Variant);
        setOutputText(decoded);
      }
    } catch (err) {
      if (actionMode === 'decode') {
        setError(t('tools.base64.invalid_string'));
        setOutputText('');
      }
    }
  };

  const handleBase64InputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);
    setError('');
    setPreviewUrl('');
    setIsImage(false);
    
    if (value.trim() === '') {
      setOutputText('');
      return;
    }

    // For file decode mode, we'll process the base64 and create a download link
    if (conversionMode === 'file' && actionMode === 'decode') {
      try {
        let dataUri = '';
        let mimeType = '';
        
        // Check if it's a data URI
        if (value.startsWith('data:')) {
          dataUri = value;
          const mimeMatch = value.match(/data:([^;]+)/);
          mimeType = mimeMatch ? mimeMatch[1] : '';
        } else {
          // If it's just base64 string, try to detect if it's an image
          try {
            // Try to decode and check if it's a valid base64
            atob(value);
            
            // Check if it looks like an image by trying common image headers
            const decoded = atob(value);
            const firstBytes = decoded.slice(0, 4);
            
            if (firstBytes.startsWith('\xFF\xD8\xFF')) {
              mimeType = 'image/jpeg';
              dataUri = `data:image/jpeg;base64,${value}`;
            } else if (firstBytes.startsWith('\x89PNG')) {
              mimeType = 'image/png';
              dataUri = `data:image/png;base64,${value}`;
            } else if (firstBytes.startsWith('GIF8')) {
              mimeType = 'image/gif';
              dataUri = `data:image/gif;base64,${value}`;
            } else if (firstBytes.startsWith('RIFF')) {
              mimeType = 'image/webp';
              dataUri = `data:image/webp;base64,${value}`;
            } else {
              mimeType = 'application/octet-stream';
              dataUri = `data:application/octet-stream;base64,${value}`;
            }
          } catch (decodeErr) {
            setError(t('tools.base64.invalid_string'));
            setOutputText('');
            return;
          }
        }
        
        setOutputText(dataUri);
        
        // Set preview if it's an image
        if (mimeType.startsWith('image/')) {
          setIsImage(true);
          setPreviewUrl(dataUri);
        }
        
      } catch (err) {
        setError(t('tools.base64.invalid_string'));
        setOutputText('');
      }
    }
  };

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

  const handleActionModeChange = (newMode: ActionMode) => {
    setActionMode(newMode);
    setInputText('');
    setOutputText('');
    setError('');
    setPreviewUrl('');
    setIsImage(false);
  };

  const handleConversionModeChange = (newMode: ConversionMode) => {
    setConversionMode(newMode);
    setInputText('');
    setOutputText('');
    setError('');
    setPreviewUrl('');
    setIsImage(false);
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
    if (outputText && !error && conversionMode === 'text') {
      setInputText(outputText);
      setOutputText('');
      setActionMode(actionMode === 'encode' ? 'decode' : 'encode');
    }
  };

  const handleDownloadFile = () => {
    if (!outputText || error || conversionMode !== 'file' || actionMode !== 'decode') return;
    
    try {
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = outputText;
      
      // Extract filename from data URI or use default
      let filename = 'decoded-file.bin';
      
      if (outputText.startsWith('data:')) {
        const mimeMatch = outputText.match(/data:([^;]+)/);
        const mimeType = mimeMatch ? mimeMatch[1] : '';
        
        if (mimeType.startsWith('image/')) {
          const extension = mimeType.split('/')[1] || 'png';
          filename = `decoded-image.${extension}`;
        } else {
          filename = 'decoded-file.bin';
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('파일 다운로드 실패:', err);
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

      {/* Conversion Mode Toggle */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => handleConversionModeChange('text')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center space-x-2 ${
              conversionMode === 'text'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>{t('tools.base64.text_mode')}</span>
          </button>
          <button
            onClick={() => handleConversionModeChange('file')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all flex items-center justify-center space-x-2 ${
              conversionMode === 'file'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{t('tools.base64.file_mode')}</span>
          </button>
        </div>

        {/* Action Mode Toggle (for text and file modes) */}
        {(conversionMode === 'text' || conversionMode === 'file') && (
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => handleActionModeChange('encode')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                actionMode === 'encode'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('tools.base64.encode')}
            </button>
            <button
              onClick={() => handleActionModeChange('decode')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                actionMode === 'decode'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('tools.base64.decode')}
            </button>
          </div>
        )}

        {/* Base64 Variant Selection (for text mode only) */}
        {conversionMode === 'text' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('tools.base64.base64_type')}
            </label>
            <select
              value={base64Variant}
              onChange={(e) => {
                const newVariant = e.target.value as Base64Variant;
                setBase64Variant(newVariant);
                // Re-process current input with new variant
                if (inputText.trim()) {
                  const value = inputText;
                  setError('');
                  
                  try {
                    if (actionMode === 'encode') {
                      const encoded = encodeBase64(value, newVariant);
                      setOutputText(encoded);
                    } else {
                      const decoded = decodeBase64(value, newVariant);
                      setOutputText(decoded);
                    }
                  } catch (err) {
                    if (actionMode === 'decode') {
                      setError(t('tools.base64.invalid_string'));
                      setOutputText('');
                    }
                  }
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="standard">{t('tools.base64.standard')}</option>
              <option value="urlsafe">{t('tools.base64.urlsafe')}</option>
            </select>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="mb-6">
        {conversionMode === 'text' && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {actionMode === 'encode' ? t('common.input_text') : t('tools.base64.title')}
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={handleTextInputChange}
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
          </>
        )}

        {conversionMode === 'file' && (
          <>
            {actionMode === 'encode' && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('tools.base64.file_upload')}
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-primary-400 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {t('tools.base64.drag_drop_file')}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {t('tools.base64.or_click_to_browse')}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {t('tools.base64.choose_file')}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                    className="hidden"
                    accept="image/*,*/*"
                  />
                </div>
              </>
            )}
            {actionMode === 'decode' && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('tools.base64.base64_input')}
                </label>
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={handleBase64InputChange}
                    placeholder={t('tools.base64.base64_input_placeholder')}
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
              </>
            )}
          </>
        )}

      </div>

      {/* Swap Button - For text mode */}
      {outputText && !error && conversionMode === 'text' && (
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
          {conversionMode === 'text' && actionMode === 'encode' ? t('tools.base64.base64_result') : 
           conversionMode === 'text' ? t('common.output_text') : 
           conversionMode === 'file' && actionMode === 'decode' ? t('tools.base64.download_file') :
           t('tools.base64.base64_result')}
        </label>
        
        {/* File decode mode - show preview and download button */}
        {conversionMode === 'file' && actionMode === 'decode' && outputText && !error && (
          <div className="space-y-4">
            {/* Image preview */}
            {isImage && previewUrl && (
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('tools.base64.image_preview')}
                </label>
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Base64 preview"
                    className="max-w-full max-h-64 object-contain border border-gray-200 rounded"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            )}
            
            {/* Download section */}
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {isImage ? t('tools.base64.image_ready') : t('tools.base64.file_ready')}
                    </p>
                    <p className="text-xs text-gray-500">{t('tools.base64.click_download')}</p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadFile}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {t('tools.base64.download')}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Regular textarea output for other modes */}
        {!(conversionMode === 'file' && actionMode === 'decode' && outputText && !error) && (
          <div className="relative">
            <textarea
              value={outputText}
              readOnly
              placeholder={loading ? t('common.loading') : t('tools.base64.output_placeholder')}
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
        )}
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">{t('common.how_to_use')}</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          {conversionMode === 'text' && (
            <>
              <li>• <strong>{t('tools.base64.encode')}:</strong> {t('tools.base64.usage.item1')}</li>
              <li>• <strong>{t('tools.base64.decode')}:</strong> {t('tools.base64.usage.item2')}</li>
              <li>• <strong>{t('common.update')}:</strong> {t('tools.base64.usage.item3')}</li>
            </>
          )}
          {conversionMode === 'file' && actionMode === 'encode' && (
            <>
              <li>• <strong>{t('tools.base64.file_upload')}:</strong> {t('tools.base64.usage.file1')}</li>
              <li>• <strong>{t('tools.base64.drag_drop')}:</strong> {t('tools.base64.usage.file2')}</li>
              <li>• <strong>{t('tools.base64.data_uri')}:</strong> {t('tools.base64.usage.file3')}</li>
            </>
          )}
          {conversionMode === 'file' && actionMode === 'decode' && (
            <>
              <li>• <strong>{t('tools.base64.decode')}:</strong> {t('tools.base64.usage.decode1')}</li>
              <li>• <strong>{t('tools.base64.download')}:</strong> {t('tools.base64.usage.decode2')}</li>
              <li>• <strong>{t('tools.base64.data_uri')}:</strong> {t('tools.base64.usage.decode3')}</li>
            </>
          )}
          <li>• <strong>{t('common.save')}:</strong> {t('tools.base64.usage.item4')}</li>
        </ul>
      </div>
    </div>
  );
};

export default Base64Converter;
