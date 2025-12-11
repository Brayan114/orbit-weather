import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, Flag } from 'lucide-react';
import { Reminder } from '../types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PRIORITY_COLORS = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
};

interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time?: string;
    priority: 'low' | 'medium' | 'high';
    description?: string;
}

// Add Event Modal
const AddEventModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<CalendarEvent, 'id'>) => void;
    selectedDate: string;
    editEvent?: CalendarEvent | null;
}> = ({ isOpen, onClose, onSave, selectedDate, editEvent }) => {
    const [title, setTitle] = useState(editEvent?.title || '');
    const [date, setDate] = useState(editEvent?.date || selectedDate);
    const [time, setTime] = useState(editEvent?.time || '');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(editEvent?.priority || 'medium');
    const [description, setDescription] = useState(editEvent?.description || '');

    // Reset form when modal opens with new data
    React.useEffect(() => {
        if (isOpen) {
            setTitle(editEvent?.title || '');
            setDate(editEvent?.date || selectedDate);
            setTime(editEvent?.time || '');
            setPriority(editEvent?.priority || 'medium');
            setDescription(editEvent?.description || '');
        }
    }, [isOpen, editEvent, selectedDate]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!title.trim()) return;
        onSave({
            title: title.trim(),
            date,
            time: time || undefined,
            priority,
            description: description.trim() || undefined,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-orbit-deep border border-orbit-glassBorder w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-white/5 flex-shrink-0">
                    <h2 className="text-lg font-display font-bold text-white">{editEvent ? 'Edit Event' : 'New Event'}</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto flex-1">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Event title..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder-gray-500"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-cyan-500 focus:outline-none [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Time (optional)</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-cyan-500 focus:outline-none [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-2">Priority</label>
                        <div className="flex gap-2">
                            {(['low', 'medium', 'high'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPriority(p)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize flex items-center justify-center gap-1 ${priority === p
                                            ? p === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                : p === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                                        }`}
                                >
                                    <Flag size={12} />
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details..."
                            rows={2}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-cyan-500 focus:outline-none placeholder-gray-500 resize-none"
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-white/5 flex gap-2 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 text-gray-400 text-sm hover:bg-white/10 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!title.trim()}
                        className="flex-1 py-2.5 rounded-xl bg-cyan-600 text-white text-sm hover:bg-cyan-500 transition-colors font-medium disabled:opacity-50"
                    >
                        {editEvent ? 'Save Changes' : 'Add Event'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CalendarView: React.FC = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
    const [events, setEvents] = useState<CalendarEvent[]>([
        { id: '1', title: 'Team Meeting', date: new Date().toISOString().split('T')[0], time: '10:00', priority: 'high' },
        { id: '2', title: 'Project Deadline', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], priority: 'high' },
        { id: '3', title: 'Lunch with client', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '12:30', priority: 'medium' },
    ]);

    const todayStr = today.toISOString().split('T')[0];

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days: { date: Date; isCurrentMonth: boolean }[] = [];

        // Previous month days
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i),
                isCurrentMonth: false,
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(currentYear, currentMonth, i),
                isCurrentMonth: true,
            });
        }

        // Next month days to fill the grid
        const remainingDays = 42 - days.length; // 6 rows × 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(currentYear, currentMonth + 1, i),
                isCurrentMonth: false,
            });
        }

        return days;
    }, [currentMonth, currentYear]);

    const getEventsForDate = (dateStr: string) => {
        return events.filter(e => e.date === dateStr);
    };

    const navigateMonth = (delta: number) => {
        const newDate = new Date(currentYear, currentMonth + delta, 1);
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
    };

    const goToToday = () => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelectedDate(todayStr);
    };

    const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
        if (editEvent) {
            setEvents(events.map(e => e.id === editEvent.id ? { ...eventData, id: editEvent.id } : e));
        } else {
            setEvents([...events, { ...eventData, id: Date.now().toString() }]);
        }
        setEditEvent(null);
    };

    const deleteEvent = (id: string) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const openAddModal = (date: string) => {
        setSelectedDate(date);
        setEditEvent(null);
        setIsModalOpen(true);
    };

    const openEditModal = (event: CalendarEvent) => {
        setEditEvent(event);
        setIsModalOpen(true);
    };

    const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

    return (
        <div className="p-6 md:p-10 w-full max-w-6xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-display font-bold text-white">Calendar</h2>
                    <p className="text-gray-400 text-sm mt-1">Schedule and manage events</p>
                </div>
                <button
                    onClick={goToToday}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors"
                >
                    Today
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 glass-panel rounded-3xl p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigateMonth(-1)}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h3 className="text-xl font-display font-bold text-white">
                            {MONTHS[currentMonth]} {currentYear}
                        </h3>
                        <button
                            onClick={() => navigateMonth(1)}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map(day => (
                            <div key={day} className="text-center text-xs text-gray-500 font-medium py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map(({ date, isCurrentMonth }, idx) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const dayEvents = getEventsForDate(dateStr);
                            const isToday = dateStr === todayStr;
                            const isSelected = dateStr === selectedDate;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className={`
                    relative aspect-square p-1 rounded-lg text-sm transition-all
                    ${isCurrentMonth ? 'text-white' : 'text-gray-600'}
                    ${isToday ? 'bg-cyan-500/20 border border-cyan-500/50' : ''}
                    ${isSelected && !isToday ? 'bg-indigo-500/20 border border-indigo-500/50' : ''}
                    ${!isToday && !isSelected ? 'hover:bg-white/5' : ''}
                  `}
                                >
                                    <span className={`${isToday ? 'text-cyan-400 font-bold' : ''}`}>
                                        {date.getDate()}
                                    </span>
                                    {/* Event Indicators */}
                                    {dayEvents.length > 0 && (
                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                            {dayEvents.slice(0, 3).map(event => (
                                                <div
                                                    key={event.id}
                                                    className={`w-1 h-1 rounded-full ${PRIORITY_COLORS[event.priority]}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Day Events */}
                <div className="glass-panel rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                            {selectedDate
                                ? new Date(selectedDate + 'T00:00:00').toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
                                : 'Select a date'}
                        </h3>
                        {selectedDate && (
                            <button
                                onClick={() => openAddModal(selectedDate)}
                                className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto">
                        {selectedEvents.length > 0 ? (
                            selectedEvents.map(event => (
                                <div
                                    key={event.id}
                                    onClick={() => openEditModal(event)}
                                    className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-1 h-full min-h-[2rem] rounded-full ${PRIORITY_COLORS[event.priority]}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-white truncate">{event.title}</p>
                                            {event.time && (
                                                <p className="text-xs text-cyan-400 flex items-center gap-1 mt-1">
                                                    <Clock size={10} />
                                                    {event.time}
                                                </p>
                                            )}
                                            {event.description && (
                                                <p className="text-xs text-gray-500 mt-1 truncate">{event.description}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}
                                            className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                                <p className="text-sm">{selectedDate ? 'No events scheduled' : 'Select a date to view events'}</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Add */}
                    {selectedDate && (
                        <button
                            onClick={() => openAddModal(selectedDate)}
                            className="mt-4 w-full py-3 rounded-xl border border-dashed border-gray-700 text-gray-500 hover:text-white hover:border-gray-500 transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <Plus size={16} /> Add Event
                        </button>
                    )}
                </div>
            </div>

            <AddEventModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditEvent(null); }}
                onSave={addEvent}
                selectedDate={selectedDate || todayStr}
                editEvent={editEvent}
            />
        </div>
    );
};

export default CalendarView;
