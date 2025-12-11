import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import WeatherView from './components/WeatherView';
import WorldClockView from './components/WorldClockView';
import ToolsView from './components/ToolsView';
import RemindersView from './components/RemindersView';
import CalendarView from './components/CalendarView';
import Background from './components/Background';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WEATHER);

  const renderView = () => {
    switch (currentView) {
      case AppView.WEATHER: return <WeatherView />;
      case AppView.CLOCK: return <WorldClockView />;
      case AppView.TOOLS: return <ToolsView />;
      case AppView.REMINDERS: return <RemindersView />;
      case AppView.CALENDAR: return <CalendarView />;
      default: return <WeatherView />;
    }
  };

  return (
    <div className="min-h-screen bg-orbit-dark flex overflow-hidden relative selection:bg-cyan-500/30">

      {/* Dynamic Animated Background */}
      <Background />

      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      <main className="flex-1 relative z-10 overflow-y-auto h-screen scroll-smooth">
        {renderView()}
      </main>
    </div>
  );
};

export default App;