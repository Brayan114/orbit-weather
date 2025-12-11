import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Check, Circle, Trash2, Calendar, Flag, Filter, ChevronDown, X, Clock, Edit2 } from 'lucide-react';
import { Reminder } from '../types';

const PRIORITY_COLORS = {
  low: { bg: 'bg-gray-500/20', border: 'border-gray-500/30', text: 'text-gray-400', label: 'Low' },
  medium: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Medium' },
  high: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400', label: 'High' },
};

const CATEGORIES = ['Personal', 'Work', 'Health', 'Finance', 'Learning', 'Other'];

// Add/Edit Reminder Modal
const ReminderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: Omit<Reminder, 'id'>) => void;
  editReminder?: Reminder | null;
}> = ({ isOpen, onClose, onSave, editReminder }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (isOpen && editReminder) {
      setText(editReminder.text);
      setPriority(editReminder.priority);
      setDueDate(editReminder.dueDate || '');
      setCategory(editReminder.category || '');
    } else if (isOpen) {
      setText('');
      setPriority('medium');
      setDueDate('');
      setCategory('');
    }
  }, [isOpen, editReminder]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!text.trim()) return;

    const today = new Date();
    const formattedDate = editReminder?.date || today.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    onSave({
      text: text.trim(),
      completed: editReminder?.completed ?? false,
      date: formattedDate,
      dueDate: dueDate || undefined,
      priority,
      category: category || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-orbit-deep border border-orbit-glassBorder w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-display font-bold text-white">{editReminder ? 'Edit Reminder' : 'New Reminder'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Text */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">What do you need to do?</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your task..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-cyan-500 focus:outline-none placeholder-gray-500 resize-none"
              autoFocus
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">Priority</label>
            <div className="flex gap-3">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${priority === p
                    ? `${PRIORITY_COLORS[p].bg} ${PRIORITY_COLORS[p].border} ${PRIORITY_COLORS[p].text}`
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  <Flag size={16} />
                  {PRIORITY_COLORS[p].label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Due Date (optional)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 text-gray-500" size={18} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">Category (optional)</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(category === cat ? '' : cat)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${category === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="flex-1 py-3 rounded-xl bg-cyan-600 text-white hover:bg-cyan-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editReminder ? 'Save Changes' : 'Add Reminder'}
          </button>
        </div>
      </div>
    </div>
  );
};

const RemindersView: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', text: 'Call the client about the landing page', completed: false, date: 'Today', priority: 'high', category: 'Work' },
    { id: '2', text: 'Update React dependencies', completed: true, date: 'Yesterday', priority: 'medium', category: 'Work' },
    { id: '3', text: 'Schedule dentist appointment', completed: false, date: 'Today', priority: 'low', category: 'Health', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: '4', text: 'Review monthly budget', completed: false, date: 'Today', priority: 'medium', category: 'Finance' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editReminder, setEditReminder] = useState<Reminder | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('priority');

  const saveReminder = (reminderData: Omit<Reminder, 'id'>) => {
    if (editReminder) {
      // Update existing reminder
      setReminders(reminders.map(r => r.id === editReminder.id ? { ...reminderData, id: editReminder.id } : r));
    } else {
      // Add new reminder
      setReminders([{ ...reminderData, id: Date.now().toString() }, ...reminders]);
    }
    setEditReminder(null);
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const openEditModal = (reminder: Reminder) => {
    setEditReminder(reminder);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditReminder(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditReminder(null);
  };

  // Get unique categories from reminders
  const usedCategories = useMemo(() => {
    const cats = new Set(reminders.map(r => r.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [reminders]);

  // Filter and sort reminders
  const filteredReminders = useMemo(() => {
    let result = [...reminders];

    // Filter by status
    if (filter === 'active') result = result.filter(r => !r.completed);
    if (filter === 'completed') result = result.filter(r => r.completed);

    // Filter by priority
    if (priorityFilter !== 'all') result = result.filter(r => r.priority === priorityFilter);

    // Filter by category
    if (categoryFilter !== 'all') result = result.filter(r => r.category === categoryFilter);

    // Sort
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } else {
      result.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      });
    }

    return result;
  }, [reminders, filter, priorityFilter, categoryFilter, sortBy]);

  // Stats
  const stats = useMemo(() => ({
    total: reminders.length,
    active: reminders.filter(r => !r.completed).length,
    completed: reminders.filter(r => r.completed).length,
    highPriority: reminders.filter(r => !r.completed && r.priority === 'high').length,
  }), [reminders]);

  const getDueDateText = (dueDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (dueDate === today) return 'Due today';
    if (dueDate === tomorrow) return 'Due tomorrow';
    if (dueDate < today) return 'Overdue';
    return `Due ${new Date(dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="p-6 md:p-10 w-full max-w-4xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Mission Log</h2>
          <p className="text-gray-400 text-sm mt-1">
            {stats.active} active • {stats.completed} completed
            {stats.highPriority > 0 && <span className="text-red-400 ml-2">• {stats.highPriority} high priority</span>}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-full transition-colors text-sm font-medium shadow-lg shadow-cyan-500/20"
        >
          <Plus size={18} /> New Reminder
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Active', value: stats.active, color: 'text-cyan-400' },
          { label: 'High Priority', value: stats.highPriority, color: 'text-red-400' },
          { label: 'Completed', value: stats.completed, color: 'text-green-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel rounded-2xl p-4 text-center">
            <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-3xl p-6 min-h-[50vh] flex flex-col">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Status Filter */}
          <div className="flex bg-white/5 rounded-xl p-1">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${showFilters ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
          >
            <Filter size={16} />
            Filters
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400 focus:outline-none focus:border-cyan-500 [color-scheme:dark]"
          >
            <option value="priority">Sort by Priority</option>
            <option value="date">Sort by Due Date</option>
          </select>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase">Priority:</span>
              {(['all', 'high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize ${priorityFilter === p
                    ? p === 'all' ? 'bg-indigo-600 text-white' : `${PRIORITY_COLORS[p as 'low' | 'medium' | 'high'].bg} ${PRIORITY_COLORS[p as 'low' | 'medium' | 'high'].text}`
                    : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {usedCategories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase">Category:</span>
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm ${categoryFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                >
                  All
                </button>
                {usedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-sm ${categoryFilter === cat ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reminders List */}
        <div className="space-y-3 flex-1">
          {filteredReminders.map(reminder => (
            <div
              key={reminder.id}
              className={`group flex items-start gap-4 p-4 rounded-xl border transition-all ${reminder.completed
                ? 'bg-white/5 border-transparent opacity-50'
                : `bg-orbit-deep/50 ${PRIORITY_COLORS[reminder.priority].border} hover:border-indigo-500/30`
                }`}
            >
              <button
                onClick={() => toggleReminder(reminder.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors mt-0.5 ${reminder.completed
                  ? 'bg-cyan-500 border-cyan-500 text-orbit-deep'
                  : 'border-gray-500 text-transparent hover:border-cyan-400'
                  }`}
              >
                <Check size={14} strokeWidth={3} />
              </button>

              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openEditModal(reminder)}>
                <p className={`text-lg ${reminder.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                  {reminder.text}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {/* Priority Badge */}
                  <span className={`px-2 py-0.5 rounded text-xs ${PRIORITY_COLORS[reminder.priority].bg} ${PRIORITY_COLORS[reminder.priority].text}`}>
                    {PRIORITY_COLORS[reminder.priority].label}
                  </span>

                  {/* Category */}
                  {reminder.category && (
                    <span className="px-2 py-0.5 rounded text-xs bg-indigo-500/20 text-indigo-400">
                      {reminder.category}
                    </span>
                  )}

                  {/* Due Date */}
                  {reminder.dueDate && (
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${reminder.dueDate < new Date().toISOString().split('T')[0] && !reminder.completed
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                      <Clock size={10} />
                      {getDueDateText(reminder.dueDate)}
                    </span>
                  )}

                  {/* Created Date */}
                  <span className="text-xs text-gray-500 font-mono">{reminder.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(reminder)}
                  className="text-gray-600 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {filteredReminders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Circle size={48} className="mb-4 opacity-20" />
              <p>{filter === 'all' ? 'No objectives pending.' : `No ${filter} objectives.`}</p>
            </div>
          )}
        </div>
      </div>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveReminder}
        editReminder={editReminder}
      />
    </div>
  );
};

export default RemindersView;