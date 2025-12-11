import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, Plus, Trash, StopCircle, X, Volume2, Edit2 } from 'lucide-react';
import { Alarm } from '../types';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// --- Stopwatch Component ---
const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - time;
      timerRef.current = window.setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <div className="relative w-72 h-72 rounded-full border-4 border-orbit-glassBorder flex items-center justify-center bg-gradient-to-br from-orbit-deep to-black shadow-[0_0_40px_rgba(99,102,241,0.1)]">
        <div className="text-6xl font-mono font-bold text-white tracking-tighter">
          {formatTime(time)}
        </div>
        {isRunning && (
          <div className="absolute inset-0 rounded-full border-t-4 border-cyan-500 animate-spin-slow opacity-50" />
        )}
      </div>

      <div className="flex gap-6 mt-12">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 ${isRunning ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-green-500/20 text-green-400 border border-green-500/50'}`}
        >
          {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        <button
          onClick={() => { setIsRunning(false); setTime(0); }}
          className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

// --- Add/Edit Alarm Modal ---
const AlarmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (alarm: Omit<Alarm, 'id'>) => void;
  editAlarm?: Alarm | null;
}> = ({ isOpen, onClose, onSave, editAlarm }) => {
  const [hours, setHours] = useState('08');
  const [minutes, setMinutes] = useState('00');
  const [label, setLabel] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [repeat, setRepeat] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (isOpen && editAlarm) {
      const [h, m] = editAlarm.time.split(':');
      setHours(h);
      setMinutes(m);
      setLabel(editAlarm.label);
      setSelectedDays(editAlarm.days);
      setRepeat(editAlarm.repeat);
    } else if (isOpen) {
      setHours('08');
      setMinutes('00');
      setLabel('');
      setSelectedDays([]);
      setRepeat(false);
    }
  }, [isOpen, editAlarm]);

  if (!isOpen) return null;

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const handleSave = () => {
    onSave({
      time: `${hours}:${minutes}`,
      label: label || 'Alarm',
      active: editAlarm?.active ?? true,
      days: selectedDays,
      repeat
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-orbit-deep border border-orbit-glassBorder w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 flex-shrink-0">
          <h2 className="text-lg font-display font-bold text-white">New Alarm</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Time Picker - More Compact */}
          <div className="flex items-center justify-center gap-2">
            <div className="text-center">
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(e.target.value.padStart(2, '0').slice(-2))}
                className="w-16 h-16 text-3xl font-mono font-bold text-center bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
              />
              <span className="block text-xs text-gray-500 mt-1">Hours</span>
            </div>
            <span className="text-3xl font-bold text-gray-500 mb-4">:</span>
            <div className="text-center">
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value.padStart(2, '0').slice(-2))}
                className="w-16 h-16 text-3xl font-mono font-bold text-center bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
              />
              <span className="block text-xs text-gray-500 mt-1">Minutes</span>
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Alarm name..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* Days of Week */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Repeat on</label>
            <div className="flex gap-1">
              {DAYS_OF_WEEK.map((day, idx) => (
                <button
                  key={day}
                  onClick={() => toggleDay(idx)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedDays.includes(idx)
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {selectedDays.length === 0
                ? 'One-time alarm'
                : selectedDays.length === 7
                  ? 'Every day'
                  : `Every ${selectedDays.map(d => DAYS_OF_WEEK[d]).join(', ')}`}
            </p>
          </div>

          {/* Repeat Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-sm text-gray-300">Repeat weekly</span>
            <button
              onClick={() => setRepeat(!repeat)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors ${repeat ? 'bg-cyan-500' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${repeat ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 flex gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 text-sm hover:bg-white/10 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-cyan-600 text-white text-sm hover:bg-cyan-500 transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Alarm Component ---
const Alarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', time: '07:00', label: 'Morning Brief', active: true, days: [1, 2, 3, 4, 5], repeat: true },
    { id: '2', time: '23:00', label: 'Deep Work', active: false, days: [], repeat: false },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAlarm, setEditAlarm] = useState<Alarm | null>(null);
  const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);

  // Check for alarms every minute
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDay = now.getDay();

      alarms.forEach(alarm => {
        if (alarm.active && alarm.time === currentTime) {
          // Check if today is a valid day for this alarm
          if (alarm.days.length === 0 || alarm.days.includes(currentDay)) {
            setTriggeredAlarm(alarm);
            // Play sound (browser notification sound)
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleEAzYMnlvYN8O0jG4rOFg0c9e8XYoXxqRmmy0pp/ckdrosiWfntNc67Km4CATU6fwJZ/hnRrps+dhn93U5PFn4GPdWiXv5iPi3Zkmb2WkY52aZ28lZGQd2udupSRknhpnLyUkpR5aJy8k5KVemidvJOSl3pnnbySkpl7Zpy8kpKafGabvJGSm31mm7yQkp1+ZZu8j5KegGSavI6SnoBkm7yOkp6AZJu8jpKegGSbvI6SnoBkm7yOkp6AZJu8jpKegGSbvI6SnoBkm7yOkp6AZA==');
              audio.play().catch(() => { });
            } catch { }
          }
        }
      });
    };

    // Initial check
    checkAlarms();

    // Check every second
    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [alarms]);

  const saveAlarm = (alarmData: Omit<Alarm, 'id'>) => {
    if (editAlarm) {
      // Update existing alarm
      setAlarms(alarms.map(a => a.id === editAlarm.id ? { ...alarmData, id: editAlarm.id } : a));
    } else {
      // Add new alarm
      setAlarms([...alarms, { ...alarmData, id: Date.now().toString() }]);
    }
    setEditAlarm(null);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const openEditModal = (alarm: Alarm) => {
    setEditAlarm(alarm);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditAlarm(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditAlarm(null);
  };

  const dismissAlarm = () => {
    if (triggeredAlarm && !triggeredAlarm.repeat) {
      // Disable one-time alarms after triggering
      setAlarms(alarms.map(a => a.id === triggeredAlarm.id ? { ...a, active: false } : a));
    }
    setTriggeredAlarm(null);
  };

  const getDaysText = (days: number[]) => {
    if (days.length === 0) return 'One time';
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Weekdays';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
    return days.map(d => DAYS_OF_WEEK[d]).join(', ');
  };

  return (
    <>
      <div className="max-w-md mx-auto py-6 space-y-4">
        {alarms.map(alarm => (
          <div key={alarm.id} className="glass-panel p-5 rounded-2xl flex items-center justify-between group">
            <div className="cursor-pointer flex-1" onClick={() => openEditModal(alarm)}>
              <div className="text-3xl font-display font-bold text-white">{alarm.time}</div>
              <div className="text-sm text-gray-400">{alarm.label}</div>
              <div className="text-xs text-cyan-400/70 mt-1">{getDaysText(alarm.days)}</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleAlarm(alarm.id)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${alarm.active ? 'bg-cyan-500' : 'bg-gray-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${alarm.active ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <button onClick={() => openEditModal(alarm)} className="text-gray-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 size={16} />
              </button>
              <button onClick={() => deleteAlarm(alarm.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={openAddModal}
          className="w-full py-4 rounded-2xl border border-dashed border-gray-700 text-gray-500 hover:text-white hover:border-gray-500 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} /> New Alarm
        </button>
      </div>

      <AlarmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveAlarm}
        editAlarm={editAlarm}
      />

      {/* Alarm Triggered Overlay */}
      {triggeredAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse">
              <Volume2 size={64} className="text-cyan-400" />
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-2">{triggeredAlarm.time}</h2>
            <p className="text-xl text-gray-400 mb-8">{triggeredAlarm.label}</p>
            <button
              onClick={dismissAlarm}
              className="px-12 py-4 bg-cyan-600 rounded-full text-white text-lg font-medium hover:bg-cyan-500 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// --- Timer Component with Custom Time Input ---
const TimerTool = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isEditing, setIsEditing] = useState(true);
  const [timerComplete, setTimerComplete] = useState(false);

  const duration = hours * 3600 + minutes * 60 + seconds;

  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setTimerComplete(true);
      // Play completion sound
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleEAzYMnlvYN8O0jG4rOFg0c9e8XYoXxqRmmy0pp/ckdrosiWfntNc67Km4CATU6fwJZ/hnRrps+dhn93U5PFn4GPdWiXv5iPi3Zkmb2WkY52aZ28lZGQd2udupSRknhpnLyUkpR5aJy8k5KVemidvJOSl3pnnbySkpl7Zpy8kpKafGabvJGSm31mm7yQkp1+ZZu8j5KegGSavI6SnoBkm7yOkp6AZJu8jpKegGSbvI6SnoBkm7yOkp6AZJu8jpKegGSbvI6SnoBkm7yOkp6AZA==');
        audio.play().catch(() => { });
      } catch { }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    if (duration === 0) return;
    setTimeLeft(duration);
    setIsActive(true);
    setIsEditing(false);
    setTimerComplete(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    setIsEditing(true);
    setTimerComplete(false);
  };

  const format = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? timeLeft / duration : 0;

  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Timer Complete Overlay */}
      {timerComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse">
              <StopCircle size={64} className="text-purple-400" />
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-2">Time's Up!</h2>
            <p className="text-xl text-gray-400 mb-8">Timer completed</p>
            <button
              onClick={resetTimer}
              className="px-12 py-4 bg-purple-600 rounded-full text-white text-lg font-medium hover:bg-purple-500 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <div className="relative mb-12">
        <svg className="w-64 h-64 transform -rotate-90">
          <circle cx="128" cy="128" r="120" stroke="#1f2937" strokeWidth="8" fill="none" />
          <circle
            cx="128" cy="128" r="120" stroke="#8b5cf6" strokeWidth="8" fill="none"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-mono font-bold text-white">
            {isEditing ? format(duration) : format(timeLeft)}
          </span>
        </div>
      </div>

      {/* Time Input (when editing) */}
      {isEditing && (
        <div className="flex items-center gap-3 mb-8">
          <div className="text-center">
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-16 h-14 text-2xl font-mono font-bold text-center bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
            />
            <span className="block text-xs text-gray-500 mt-1">hrs</span>
          </div>
          <span className="text-2xl text-gray-500 font-bold">:</span>
          <div className="text-center">
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-16 h-14 text-2xl font-mono font-bold text-center bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
            />
            <span className="block text-xs text-gray-500 mt-1">min</span>
          </div>
          <span className="text-2xl text-gray-500 font-bold">:</span>
          <div className="text-center">
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-16 h-14 text-2xl font-mono font-bold text-center bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500 focus:outline-none"
            />
            <span className="block text-xs text-gray-500 mt-1">sec</span>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {isEditing ? (
          <button
            onClick={startTimer}
            disabled={duration === 0}
            className="px-8 py-3 bg-indigo-600 rounded-full text-white font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start
          </button>
        ) : (
          <>
            {!isActive ? (
              <button onClick={() => setIsActive(true)} className="px-8 py-3 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full font-medium hover:bg-green-500/30 transition-colors">Resume</button>
            ) : (
              <button onClick={() => setIsActive(false)} className="px-8 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full font-medium hover:bg-red-500/30 transition-colors">Pause</button>
            )}
          </>
        )}
        <button onClick={resetTimer} className="px-8 py-3 bg-white/10 rounded-full text-white font-medium hover:bg-white/20 transition-colors">Reset</button>
      </div>

      {/* Quick Select Presets */}
      {isEditing && (
        <div className="mt-8 flex gap-3 flex-wrap justify-center">
          {[
            { label: '1m', h: 0, m: 1, s: 0 },
            { label: '5m', h: 0, m: 5, s: 0 },
            { label: '15m', h: 0, m: 15, s: 0 },
            { label: '25m', h: 0, m: 25, s: 0 },
            { label: '30m', h: 0, m: 30, s: 0 },
            { label: '1h', h: 1, m: 0, s: 0 },
          ].map(preset => (
            <button
              key={preset.label}
              onClick={() => { setHours(preset.h); setMinutes(preset.m); setSeconds(preset.s); }}
              className="px-4 py-2 rounded-lg bg-orbit-deep border border-white/10 text-sm text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ToolsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alarm' | 'timer' | 'stopwatch'>('stopwatch');

  return (
    <div className="p-6 md:p-10 w-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-display font-bold text-white mb-8">Chronometer</h2>

      <div className="glass-panel rounded-3xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="flex border-b border-white/10">
          {[
            { id: 'stopwatch', label: 'Stopwatch', icon: RotateCcw },
            { id: 'timer', label: 'Timer', icon: StopCircle },
            { id: 'alarm', label: 'Alarm', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-white/5 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-white'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6">
          {activeTab === 'stopwatch' && <Stopwatch />}
          {activeTab === 'alarm' && <Alarms />}
          {activeTab === 'timer' && <TimerTool />}
        </div>
      </div>
    </div>
  );
};

export default ToolsView;