import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, RotateCcw, Save, Trash2 } from 'lucide-react';

interface Lap {
  time: number;
  label: string;
  timestamp: Date;
}

const Stopwatch: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [editingLapIndex, setEditingLapIndex] = useState<number | null>(null);
  const [editingLapLabel, setEditingLapLabel] = useState('');
  const lapsListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!isRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (lapsListRef.current) {
      lapsListRef.current.scrollTop = lapsListRef.current.scrollHeight;
    }
  }, [laps]);

  const handleStartPause = () => {
    if (!isRunning && time === 0) {
      setLaps([{ time: 0, label: t('tools.stopwatch.start_label'), timestamp: new Date() }]);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleRecord = () => {
    setLaps((prevLaps) => [
      ...prevLaps,
      { time, label: `${t('tools.stopwatch.lap')} ${laps.length}`, timestamp: new Date() },
    ]);
  };

  const handleLapLabelDoubleClick = (index: number) => {
    setEditingLapIndex(index);
    setEditingLapLabel(laps[index].label);
  };

  const handleLapLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingLapLabel(e.target.value);
  };

  const handleLapLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      const newLaps = [...laps];
      newLaps[index].label = editingLapLabel;
      setLaps(newLaps);
      setEditingLapIndex(null);
    }
  };

  const handleLapLabelBlur = (index: number) => {
    const newLaps = [...laps];
    newLaps[index].label = editingLapLabel;
    setLaps(newLaps);
    setEditingLapIndex(null);
  };

  const handleDeleteLap = (index: number) => {
    const newLaps = [...laps];
    newLaps.splice(index, 1);
    setLaps(newLaps);
  };

  const handleClearLaps = () => {
    setLaps([]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (date: Date) => {
    try {
      return date.toLocaleTimeString(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return date.toLocaleTimeString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('tools.stopwatch.title')}
        </h2>
        <div className="text-6xl font-mono text-gray-800 my-8">
          {formatTime(time)}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartPause}
            className={`btn ${
              isRunning ? 'btn-warning' : 'btn-primary'
            } w-32 flex items-center justify-center`}
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 mr-2" />
                {t('tools.stopwatch.pause')}
              </>
            ) : time > 0 ? (
              <>
                <Play className="w-6 h-6 mr-2" />
                {t('tools.stopwatch.continue')}
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2" />
                {t('tools.stopwatch.start')}
              </>
            )}
          </button>
          <button
            onClick={handleRecord}
            className="btn btn-info w-32 flex items-center justify-center"
            disabled={time === 0}
          >
            <Save className="w-6 h-6 mr-2" />
            {t('tools.stopwatch.record')}
          </button>
          <button
            onClick={handleReset}
            className="btn btn-secondary w-32 flex items-center justify-center"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            {t('tools.stopwatch.reset')}
          </button>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {t('tools.stopwatch.records')}
          </h3>
          {laps.length > 0 && (
            <button
              onClick={handleClearLaps}
              className="text-gray-500 hover:text-red-500 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {t('tools.stopwatch.clear_all')}
            </button>
          )}
        </div>
        <ul
          ref={lapsListRef}
          className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto min-h-60"
        >
          {laps.length > 0 ? (
            laps.map((lap, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
              >
                <div
                  onDoubleClick={() => handleLapLabelDoubleClick(index)}
                  className="flex-grow"
                >
                  {editingLapIndex === index ? (
                    <input
                      type="text"
                      value={editingLapLabel}
                      onChange={handleLapLabelChange}
                      onKeyDown={(e) => handleLapLabelKeyDown(e, index)}
                      onBlur={() => handleLapLabelBlur(index)}
                      className="bg-transparent border-b border-gray-400 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="text-gray-600">{lap.label}</span>
                  )}
                </div>
                <div className="text-right flex items-center">
                  <span className="font-mono text-gray-800">
                    {formatTime(lap.time)}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatTimestamp(lap.timestamp)}
                  </span>
                  <button
                    onClick={() => handleDeleteLap(index)}
                    className="ml-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="flex justify-center items-center text-gray-500 min-h-full">
              {t('tools.stopwatch.no_records')}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Stopwatch;

