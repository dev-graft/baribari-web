import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Download, Type, Palette, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SlackEmojiGeneratorProps {
  className?: string;
}

type EmojiSize = '128' | '64' | '32';
type TextAlign = 'left' | 'center' | 'right';
type FontFamily = 'Arial' | 'Helvetica' | 'Times New Roman' | 'Georgia' | 'Verdana' | 'Comic Sans MS' | 'Impact' | 'Trebuchet MS';

const SlackEmojiGenerator: React.FC<SlackEmojiGeneratorProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [text, setText] = useState('안녕\n하세요');
  const [emojiName, setEmojiName] = useState('my_emoji');
  const [emojiSize, setEmojiSize] = useState<EmojiSize>('128');
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#4f46e5');
  const [fontFamily, setFontFamily] = useState<FontFamily>('Arial');
  const [fontSize, setFontSize] = useState(32);
  const [textAlign, setTextAlign] = useState<TextAlign>('center');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const generateEmojiImage = () => {
    const canvas = canvasRef.current;
    const previewCanvas = previewCanvasRef.current;

    if (!canvas || !previewCanvas) return;

    const size = parseInt(emojiSize);
    const ctx = canvas.getContext('2d');
    const previewCtx = previewCanvas.getContext('2d');

    if (!ctx || !previewCtx) return;

    // Setup main canvas (for download)
    canvas.width = size;
    canvas.height = size;

    // Setup preview canvas with high DPI for better quality
    const displaySize = Math.min(size, 128);
    const pixelRatio = window.devicePixelRatio || 1;

    previewCanvas.width = displaySize * pixelRatio;
    previewCanvas.height = displaySize * pixelRatio;
    previewCanvas.style.width = displaySize + 'px';
    previewCanvas.style.height = displaySize + 'px';

    // Scale the preview context for high DPI
    previewCtx.scale(pixelRatio, pixelRatio);

    // Draw on main canvas
    drawEmojiOnCanvas(ctx, size);

    // Draw on preview canvas (scaled to display size)
    drawEmojiOnCanvas(previewCtx, displaySize);
  };

  const drawEmojiOnCanvas = (context: CanvasRenderingContext2D, canvasSize: number) => {
    // Clear canvas
    context.clearRect(0, 0, canvasSize, canvasSize);

    // Fill background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvasSize, canvasSize);

    // Setup text style with anti-aliasing
    const calculatedFontSize = Math.floor((fontSize * canvasSize) / 128);
    context.font = `${calculatedFontSize}px ${fontFamily}`;
    context.fillStyle = textColor;
    context.textBaseline = 'middle';

    // Enable text anti-aliasing for better quality
    context.textRenderingOptimization = 'optimizeQuality';

    // Split text by lines
    const lines = text.split('\n');
    const lineHeight = calculatedFontSize * 1.2;
    const totalTextHeight = lines.length * lineHeight;

    // Calculate starting Y position to center all lines vertically
    const startY = (canvasSize - totalTextHeight) / 2 + lineHeight / 2;

    // Calculate text position for horizontal alignment
    let x: number;

    switch (textAlign) {
      case 'left':
        context.textAlign = 'left';
        x = canvasSize * 0.1;
        break;
      case 'right':
        context.textAlign = 'right';
        x = canvasSize * 0.9;
        break;
      case 'center':
      default:
        context.textAlign = 'center';
        x = canvasSize / 2;
        break;
    }

    // Draw each line
    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      context.fillText(line, x, y);
    });
  };

  // Generate emoji whenever settings change
  useEffect(() => {
    generateEmojiImage();
  }, [text, emojiSize, textColor, backgroundColor, fontFamily, fontSize, textAlign]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create download link
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${emojiName || 'slack_emoji'}_${emojiSize}x${emojiSize}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };


  const handleClear = () => {
    setText('안녕\n하세요');
    setEmojiName('my_emoji');
    setTextColor('#ffffff');
    setBackgroundColor('#4f46e5');
    setFontFamily('Arial');
    setFontSize(32);
    setTextAlign('center');
    setEmojiSize('128');
  };

  const getAlignIcon = () => {
    switch (textAlign) {
      case 'left': return AlignLeft;
      case 'right': return AlignRight;
      case 'center':
      default: return AlignCenter;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Hidden canvas for actual emoji generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.slack_emoji.title')}</h2>
          <p className="text-gray-600">
            {t('tools.slack_emoji.description')}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="w-4 h-4 inline mr-1" />
              {t('tools.slack_emoji.text_input')}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('tools.slack_emoji.text_placeholder')}
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Emoji Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('tools.slack_emoji.emoji_name')}
            </label>
            <input
              type="text"
              value={emojiName}
              onChange={(e) => setEmojiName(e.target.value)}
              placeholder={t('tools.slack_emoji.emoji_name_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Font Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.slack_emoji.font_family')}
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Impact">Impact</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.slack_emoji.font_size')} ({fontSize}px)
              </label>
              <input
                type="range"
                min="12"
                max="120"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Color Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4 inline mr-1" />
                {t('tools.slack_emoji.text_color')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-6 border-0 rounded cursor-pointer bg-transparent"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.slack_emoji.background_color')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-6 border-0 rounded cursor-pointer bg-transparent"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Alignment and Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.slack_emoji.text_align')}
              </label>
              <div className="flex space-x-1">
                {(['left', 'center', 'right'] as TextAlign[]).map((align) => {
                  const Icon = align === 'left' ? AlignLeft : align === 'right' ? AlignRight : AlignCenter;
                  return (
                    <button
                      key={align}
                      onClick={() => setTextAlign(align)}
                      className={`flex-1 p-2 border rounded-lg transition-colors ${
                        textAlign === align
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.slack_emoji.emoji_size')}
              </label>
              <select
                value={emojiSize}
                onChange={(e) => setEmojiSize(e.target.value as EmojiSize)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="128">128×128px ({t('tools.slack_emoji.recommended')})</option>
                <option value="64">64×64px</option>
                <option value="32">32×32px</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('tools.slack_emoji.preview')}
            </label>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 text-center">
              <div className="inline-block bg-white border border-gray-200 rounded-lg p-4">
                <canvas
                  ref={previewCanvasRef}
                  className="max-w-32 max-h-32 block"
                  style={{
                    imageRendering: 'crisp-edges'
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {emojiSize}×{emojiSize}px
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{t('tools.slack_emoji.download_emoji')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">{t('tools.slack_emoji.how_to_use_slack')}</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>{t('tools.slack_emoji.instruction_1')}</li>
          <li>{t('tools.slack_emoji.instruction_2')}</li>
          <li>{t('tools.slack_emoji.instruction_3')}</li>
          <li>{t('tools.slack_emoji.instruction_4')}</li>
          <li>{t('tools.slack_emoji.instruction_5')}</li>
        </ol>

        <div className="mt-3 pt-3 border-t border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-1">{t('tools.slack_emoji.tips')}</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {t('tools.slack_emoji.tip_1')}</li>
            <li>• {t('tools.slack_emoji.tip_2')}</li>
            <li>• {t('tools.slack_emoji.tip_3')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SlackEmojiGenerator;