import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, RotateCcw, Download, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import QRCodeLibrary from 'qrcode';

interface QRCodeGeneratorProps {
  className?: string;
}

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
type QRCodeType = 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi';

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [qrCodeType, setQrCodeType] = useState<QRCodeType>('text');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('M');
  const [width, setWidth] = useState(256);
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // WiFi specific fields
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Email specific fields
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // SMS specific fields
  const [smsNumber, setSmsNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  const generateQRCodeText = (): string => {
    switch (qrCodeType) {
      case 'url':
        return inputText.startsWith('http') ? inputText : `https://${inputText}`;
      case 'email':
        let emailString = `mailto:${emailTo}`;
        const params = [];
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`);
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`);
        if (params.length > 0) emailString += `?${params.join('&')}`;
        return emailString;
      case 'phone':
        return `tel:${inputText}`;
      case 'sms':
        return `sms:${smsNumber}${smsMessage ? `?body=${encodeURIComponent(smsMessage)}` : ''}`;
      case 'wifi':
        return `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'text':
      default:
        return inputText;
    }
  };

  const generateQRCode = async () => {
    const textToEncode = generateQRCodeText();
    
    if (!textToEncode.trim()) {
      setQrCodeDataURL('');
      setError('');
      return;
    }

    try {
      setError('');
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCodeLibrary.toCanvas(canvas, textToEncode, {
          errorCorrectionLevel,
          width,
          color: {
            dark: color,
            light: backgroundColor,
          },
          margin: 2,
        });

        const dataURL = canvas.toDataURL();
        setQrCodeDataURL(dataURL);
      }
    } catch (err) {
      setError(t('tools.qrcode.generation_error'));
      setQrCodeDataURL('');
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [inputText, qrCodeType, errorCorrectionLevel, width, color, backgroundColor, wifiSSID, wifiPassword, wifiSecurity, wifiHidden, emailTo, emailSubject, emailBody, smsNumber, smsMessage]);

  const handleCopy = async () => {
    if (!qrCodeDataURL) return;

    try {
      const response = await fetch(qrCodeDataURL);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      try {
        await navigator.clipboard.writeText(qrCodeDataURL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('클립보드 복사 실패:', fallbackErr);
      }
    }
  };

  const handleDownload = () => {
    if (!qrCodeDataURL) return;

    const link = document.createElement('a');
    link.href = qrCodeDataURL;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setInputText('');
    setWifiSSID('');
    setWifiPassword('');
    setEmailTo('');
    setEmailSubject('');
    setEmailBody('');
    setSmsNumber('');
    setSmsMessage('');
    setQrCodeDataURL('');
    setError('');
  };

  const renderInputFields = () => {
    switch (qrCodeType) {
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.qrcode.wifi_ssid')}
              </label>
              <input
                type="text"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                placeholder={t('tools.qrcode.wifi_ssid_placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.qrcode.wifi_password')}
              </label>
              <input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder={t('tools.qrcode.wifi_password_placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.qrcode.wifi_security')}
              </label>
              <select
                value={wifiSecurity}
                onChange={(e) => setWifiSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">{t('tools.qrcode.wifi_no_password')}</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="wifi-hidden"
                checked={wifiHidden}
                onChange={(e) => setWifiHidden(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="wifi-hidden" className="text-sm text-gray-700">
                {t('tools.qrcode.wifi_hidden')}
              </label>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.qrcode.email_to')}
              </label>
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder={t('tools.qrcode.email_to_placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.qrcode.email_subject')}
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder={t('tools.qrcode.email_subject_placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.qrcode.email_body')}
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder={t('tools.qrcode.email_body_placeholder')}
                className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        );

      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.qrcode.sms_number')}
              </label>
              <input
                type="tel"
                value={smsNumber}
                onChange={(e) => setSmsNumber(e.target.value)}
                placeholder={t('tools.qrcode.sms_number_placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tools.qrcode.sms_message')}
              </label>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder={t('tools.qrcode.sms_message_placeholder')}
                className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {qrCodeType === 'url' ? t('tools.qrcode.url_input') : 
               qrCodeType === 'phone' ? t('tools.qrcode.phone_input') :
               t('common.input_text')}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                qrCodeType === 'url' ? t('tools.qrcode.url_placeholder') :
                qrCodeType === 'phone' ? t('tools.qrcode.phone_placeholder') :
                t('tools.qrcode.text_placeholder')
              }
              className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
        );
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('tools.qrcode.title')}</h2>
          <p className="text-gray-600">
            {t('tools.qrcode.description')}
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

      {/* QR Code Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('tools.qrcode.type')}
        </label>
        <select
          value={qrCodeType}
          onChange={(e) => {
            setQrCodeType(e.target.value as QRCodeType);
            handleClear();
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="text">{t('tools.qrcode.type_text')}</option>
          <option value="url">{t('tools.qrcode.type_url')}</option>
          <option value="email">{t('tools.qrcode.type_email')}</option>
          <option value="phone">{t('tools.qrcode.type_phone')}</option>
          <option value="sms">{t('tools.qrcode.type_sms')}</option>
          <option value="wifi">{t('tools.qrcode.type_wifi')}</option>
        </select>
      </div>

      {/* Input Fields */}
      <div className="mb-6">
        {renderInputFields()}
      </div>

      {/* QR Code Options */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('tools.qrcode.error_correction')}
          </label>
          <select
            value={errorCorrectionLevel}
            onChange={(e) => setErrorCorrectionLevel(e.target.value as ErrorCorrectionLevel)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="L">{t('tools.qrcode.error_low')}</option>
            <option value="M">{t('tools.qrcode.error_medium')}</option>
            <option value="Q">{t('tools.qrcode.error_quartile')}</option>
            <option value="H">{t('tools.qrcode.error_high')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('tools.qrcode.size')}
          </label>
          <select
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={128}>128x128</option>
            <option value={256}>256x256</option>
            <option value={512}>512x512</option>
            <option value={1024}>1024x1024</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('tools.qrcode.foreground_color')}
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('tools.qrcode.background_color')}
          </label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* QR Code Preview */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('tools.qrcode.preview')}
        </label>
        <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 flex justify-center">
          {qrCodeDataURL ? (
            <div className="text-center">
              <canvas
                ref={canvasRef}
                className="border border-gray-200 rounded-lg mb-4"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t('common.copied') : t('common.save')}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('common.download')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>{error || t('tools.qrcode.no_preview')}</p>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">{t('common.how_to_use')}</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>{t('tools.qrcode.type')}:</strong> {t('tools.qrcode.usage.item1')}</li>
          <li>• <strong>{t('common.input_text')}:</strong> {t('tools.qrcode.usage.item2')}</li>
          <li>• <strong>{t('tools.qrcode.customize')}:</strong> {t('tools.qrcode.usage.item3')}</li>
          <li>• <strong>{t('tools.qrcode.save_download')}:</strong> {t('tools.qrcode.usage.item4')}</li>
        </ul>
      </div>
    </div>
  );
};

export default QRCodeGenerator;