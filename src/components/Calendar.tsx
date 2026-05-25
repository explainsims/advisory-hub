import React, { useState, useMemo, useEffect } from 'react';
import { 
  startOfWeek, 
  addWeeks, 
  subWeeks, 
  addDays, 
  format, 
  parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { Grade, CalendarEvent, ViewMode, UserRole } from '../types';
import { seedData } from '../lib/data';
import { schoolSchedule } from '../lib/schedule';

import Flipbook from './Flipbook';

import CaselWheel from './CaselWheel';

const COLORS = [
  'bg-white', 'bg-[#ebf8ff]', 'bg-[#e7e8da]', 'bg-[#f7d5ba]', 'bg-[#8cacd3]', 'bg-[#7b9626]'
];

interface EditModalProps {
  event: CalendarEvent | null;
  cellDate: string;
  cellGrade: Grade;
  onSave: (content: string, color: string) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ event, cellDate, cellGrade, onSave, onClose }) => {
  const [content, setContent] = useState(event?.content || '');
  const [color, setColor] = useState(event?.color || 'bg-white');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50/50 rounded-t-xl">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Edit Event: {format(parseISO(cellDate), 'MMM d, yyyy')} - <span className="text-indigo-600">{cellGrade === 'all' ? 'All Grades' : cellGrade.toUpperCase()}</span>
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 flex flex-col gap-5">
          <div className="flex justify-between items-start">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Background Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-8 h-8 rounded-md border",
                      c,
                      color === c ? "border-indigo-600 scale-110 shadow-sm ring-2 ring-indigo-600/20" : "border-slate-200 hover:border-slate-300"
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono">
              <span className="font-bold text-slate-500 uppercase">Link Format:</span><br/>
              [Link text](https://url.com)
            </div>
          </div>
          
          <div className="flex-1 flex flex-col min-h-[250px]">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Content
            </label>
            <textarea
              className="w-full flex-1 p-3 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono text-sm resize-none text-slate-700 placeholder:text-slate-400"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter event details here..."
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(content, color)}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdvisoryCalendar() {
  const [role, setRole] = useState<UserRole>('adv');
  const [viewMode, setViewMode] = useState<ViewMode>('1week');
  const [activeTab, setActiveTab] = useState<'calendar' | 'resources'>('calendar');
  
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    return new Date('2026-08-10T00:00:00'); 
  });

  const handleToday = () => {
    const today = new Date();
    const minDate = new Date('2026-08-10T00:00:00');
    if (today < minDate) {
      setCurrentDate(minDate);
    } else {
      setCurrentDate(today);
    }
  };

  const [events, setEvents] = useState<Record<string, CalendarEvent>>(() => {
    const stored = localStorage.getItem('advisory_events_v4');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed parsing stored events", e);
      }
    }
    
    const map: Record<string, CalendarEvent> = {};
    seedData.forEach(event => {
      map[`${event.date}-${event.grade}`] = event;
    });
    return map;
  });

  useEffect(() => {
    localStorage.setItem('advisory_events_v4', JSON.stringify(events));
  }, [events]);

  const [editingCell, setEditingCell] = useState<{date: string, grade: Grade} | null>(null);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); 

  const weeks = useMemo(() => {
    const w = [];
    const numWeeks = viewMode === '1week' ? 1 : 10;
    
    for (let i = 0; i < numWeeks; i++) {
      const weekStart = addWeeks(startOfCurrentWeek, i);
      const days = [];
      for (let j = 0; j < 5; j++) {
        const d = addDays(weekStart, j);
        days.push({
          dateStr: format(d, 'yyyy-MM-dd'),
          dayOfWeek: format(d, 'EEEE'),
          dateFormatted: format(d, 'MMM d')
        });
      }
      w.push({
        id: `week-${i}`,
        startDateStr: format(weekStart, 'MMMM d, yyyy'),
        days
      });
    }
    return w;
  }, [startOfCurrentWeek, viewMode]);

  const handlePrevWeek = () => setCurrentDate((prev) => subWeeks(prev, viewMode === '1week' ? 1 : 10));
  const handleNextWeek = () => setCurrentDate((prev) => addWeeks(prev, viewMode === '1week' ? 1 : 10));

  const handleSaveEvent = (content: string, color: string) => {
    if (!editingCell) return;
    const { date, grade } = editingCell;
    const key = `${date}-${grade}`;
    
    setEvents(prev => {
      const newEvents = { ...prev };
      if (!content.trim() && color === 'bg-white') {
        delete newEvents[key];
      } else {
        newEvents[key] = { date, grade, content, color };
      }
      return newEvents;
    });
    setEditingCell(null);
  };

  const renderCell = (dayStr: string, grade: Grade) => {
    const key = `${dayStr}-${grade}`;
    const event = events[key];
    const isEditMode = role === 'pdl';
    const bgClass = event?.color || 'bg-white';

    return (
      <td 
        key={key} 
        className={cn(
          "border-r border-slate-200 p-3 h-32 align-top text-sm transition-colors",
          bgClass,
          isEditMode && "cursor-pointer hover:opacity-80 ring-inset hover:ring-2 hover:ring-indigo-400 group/cell"
        )}
        onClick={() => {
          if (isEditMode) {
            setEditingCell({ date: dayStr, grade });
          }
        }}
        title={isEditMode ? "Click to edit" : undefined}
      >
        <div className="markdown-body h-full w-full relative flex flex-col">
          {event?.content ? (
            <>
              <ReactMarkdown 
                components={{ 
                  a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} /> 
                }}
              >
                {event.content}
              </ReactMarkdown>
              {isEditMode && (
                <button className="opacity-0 group-hover/cell:opacity-100 text-[10px] text-indigo-800 bg-indigo-200/50 py-1 px-2 rounded transition-opacity font-bold mt-auto self-start z-10 w-full hover:bg-indigo-300 pointer-events-none">Edit Content</button>
              )}
            </>
          ) : (
            isEditMode && <div className="text-slate-400 italic opacity-0 group-hover/cell:opacity-100 text-xs font-semibold flex items-center justify-center h-full">Click to add</div>
          )}
        </div>
      </td>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0635aa] rounded flex items-center justify-center text-white font-bold text-xl shadow-md overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 leading-tight">Advisory Hub</h1>
            <p className="text-xs text-slate-500 font-medium">School Year 2026-2027</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={cn("px-4 py-1 text-xs font-bold rounded-full transition-colors", activeTab === 'calendar' ? "bg-[#0635aa] text-white shadow-sm" : "text-slate-500 hover:text-[#0635aa]")}
          >
            Calendar
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={cn("px-4 py-1 text-xs font-bold rounded-full transition-colors", activeTab === 'resources' ? "bg-[#fec707] text-[#232f49] shadow-sm" : "text-slate-500 hover:text-[#fec707]")}
          >
            Resources
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            <button 
              onClick={() => setRole('adv')}
              className={cn("px-4 py-1 text-xs font-bold rounded-full transition-colors", role === 'adv' ? "bg-[#7b9626] text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              Adv
            </button>
            <button 
              onClick={() => setRole('pdl')}
              className={cn("px-4 py-1 text-xs font-bold rounded-full transition-colors", role === 'pdl' ? "bg-[#f26544] text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              PDL
            </button>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      {activeTab === 'calendar' && (
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative overflow-hidden">
        <div className="flex items-center gap-4 shrink-0 bg-white z-10 pr-4">
          <button onClick={handlePrevWeek} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors group">
            <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Previous
          </button>
          <button onClick={handleToday} className="bg-slate-100 border border-slate-200 hover:bg-slate-200 px-4 py-1.5 rounded font-bold text-sm transition-colors cursor-pointer" style={{ color: '#232f49' }} title="Jump to current week">
            {weeks[0]?.startDateStr} {viewMode === 'scroll' ? ` - ${format(addDays(startOfCurrentWeek, (10 * 7) - 3), 'MMMM d, yyyy')}` : ''}
          </button>
          <button onClick={handleNextWeek} className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors group">
            Next
            <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-end overflow-x-auto min-w-0 pl-12 h-full">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 mr-2">
            <button 
              onClick={() => {
                setViewMode('1week');
                setCurrentDate(new Date('2026-08-10T00:00:00'));
              }}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-md transition-colors",
                viewMode === '1week' ? "bg-white shadow-sm text-[#0635aa]" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Weekly View
            </button>
            <button 
              onClick={() => setViewMode('scroll')}
              className={cn(
                "px-4 py-1.5 text-xs font-semibold rounded-md transition-colors",
                viewMode === 'scroll' ? "bg-white shadow-sm text-[#0635aa]" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Scroll
            </button>
          </div>
        </div>
      </div>
      )}

      <main className="flex-1 flex overflow-hidden max-w-[1600px] w-full mx-auto p-4 lg:p-6 lg:pb-0">
        {activeTab === 'resources' ? (
          <div className="flex-1 overflow-auto bg-slate-50 rounded-t-xl shadow-sm border-x border-t border-slate-200">
            <div className="p-8 h-full flex flex-col">
              {/* Grade-Level Drive Tiles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <a
                  href="https://drive.google.com/drive/folders/13bEst2tF6vHw198DXYBJCQYZqo93Fz_D?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center rounded-xl py-6 px-4 text-white font-extrabold text-xl tracking-tight shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 overflow-hidden"
                  style={{ backgroundColor: '#0635aa' }}
                >
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200 rounded-xl" />
                  <span className="relative flex items-center gap-2">
                    <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                    Grade 9
                  </span>
                </a>
                <a
                  href="https://drive.google.com/drive/folders/1lZxjeJITiAjJ_JttV9PzQlwSaXsagZH1?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center rounded-xl py-6 px-4 font-extrabold text-xl tracking-tight shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 overflow-hidden"
                  style={{ backgroundColor: '#fec707', color: '#232f49' }}
                >
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200 rounded-xl" />
                  <span className="relative flex items-center gap-2">
                    <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                    Grade 10
                  </span>
                </a>
                <a
                  href="https://drive.google.com/drive/folders/1qjbwcMNtAKzY5fXHFNeHEW1Z_6H1f3Bc?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center rounded-xl py-6 px-4 text-white font-extrabold text-xl tracking-tight shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 overflow-hidden"
                  style={{ backgroundColor: '#7b9626' }}
                >
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200 rounded-xl" />
                  <span className="relative flex items-center gap-2">
                    <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                    Grade 11
                  </span>
                </a>
                <a
                  href="https://drive.google.com/drive/folders/1h4JpXLIvkYMZLsOs2HWEAR2nhqt6q8BK?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center rounded-xl py-6 px-4 text-white font-extrabold text-xl tracking-tight shadow-md hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 overflow-hidden"
                  style={{ backgroundColor: '#f26544' }}
                >
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200 rounded-xl" />
                  <span className="relative flex items-center gap-2">
                    <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                    Grade 12
                  </span>
                </a>
              </div>

              <div className="flex justify-between items-start mb-8">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Advisory Resources</h2>
                  <p className="text-slate-500 max-w-lg mb-8">
                    A collection of tools, links, and materials to help you plan and execute your advisory sessions.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                    <a href="https://docs.google.com/presentation/d/1KBs7fovkkQnukKnYXbBTR32QKj2q22WEmsLfqGd-BDU/edit" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
                      <div className="w-10 h-10 bg-[#fec707]/10 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#fec707]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Check-in Slides</h4>
                        <span className="text-xs text-slate-500 font-medium">Google Slides</span>
                      </div>
                    </a>
                    
                    <a href="https://drive.google.com/drive/folders/1C3aHkKuQ8ubVZSIblPMpHWPSg9yaye2p?usp=drive_link" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
                      <div className="w-10 h-10 bg-[#0635aa]/10 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#0635aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Open Session</h4>
                        <span className="text-xs text-slate-500 font-medium">Google Drive</span>
                      </div>
                    </a>

                    <a href="https://docs.google.com/document/d/10agj88yGH_APBUi3zh2NlPk9t47VhTUf1OxazNeY-MA/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
                      <div className="w-10 h-10 bg-[#0635aa]/10 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#0635aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Discussion Protocols</h4>
                        <span className="text-xs text-slate-500 font-medium">Google Doc</span>
                      </div>
                    </a>

                    <a href="https://docs.google.com/document/d/1DpMWVVyRnpNDeG8T3Kr3yNyFte0lS8bLCGKiPJACK6s/edit?usp=drive_link" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group">
                      <div className="w-10 h-10 bg-[#0635aa]/10 rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#0635aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Advisory Room Layouts</h4>
                        <span className="text-xs text-slate-500 font-medium">Google Doc</span>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="shrink-0 pl-16 pt-4">
                  <Flipbook />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1 mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">CASEL Framework</h3>
                <CaselWheel />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-t-xl shadow-sm border-x border-t border-slate-200 overflow-hidden min-w-[1000px] w-full flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 text-[10px] uppercase font-black tracking-widest sticky top-0 z-10">
                <tr>
                  <th className="w-[12%] p-3 border-r border-slate-200 text-center">Day / Date</th>
                  <th className="w-[17%] p-3 border-r border-slate-200 text-center">All / General</th>
                  <th className="w-[17%] p-3 border-r border-slate-200 text-center">Grade 9</th>
                  <th className="w-[17%] p-3 border-r border-slate-200 text-center">Grade 10</th>
                  <th className="w-[17%] p-3 border-r border-slate-200 text-center">Grade 11</th>
                  <th className="w-[17%] p-3 text-center">Grade 12</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 bg-white">
                {weeks.map(week => (
                  <React.Fragment key={week.id}>
                    {viewMode === 'scroll' && (
                      <tr className="bg-indigo-50">
                        <td colSpan={6} className="px-4 py-2 font-bold text-indigo-800 border-b border-indigo-100 shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                          Week of {week.startDateStr}
                        </td>
                      </tr>
                    )}
                    {week.days.map(day => {
                      const isAdvisoryDay = day.dayOfWeek === 'Tuesday' || day.dayOfWeek === 'Thursday';
                      return (
                      <tr key={day.dateStr} className={cn("group overflow-hidden", isAdvisoryDay && "relative z-20 outline outline-1 outline-[#0635aa] outline-offset-[-1px]")}>
                        <td className={cn(
                          "border-r border-slate-200 p-3 align-top text-center flex-col justify-center h-32 transition-colors relative",
                          isAdvisoryDay ? "bg-[#8cacd3]" : "bg-slate-50"
                        )}>
                          <div className={cn("text-xs font-bold uppercase mt-4 relative z-10", isAdvisoryDay ? "text-[#0635aa]" : "text-slate-800")}>{day.dayOfWeek}</div>
                          <div className={cn("text-xs font-black mt-1 relative z-10", isAdvisoryDay ? "text-[#0635aa]" : "text-slate-400")}>{day.dateFormatted}</div>
                          {schoolSchedule[day.dateStr] && (() => {
                            const sched = schoolSchedule[day.dateStr];
                            const isRegularDay = ['ABCD', 'EFGH', 'BCDA', 'FGHE', 'CDAB', 'GHEF', 'DABC', 'HEFG'].includes(sched);
                            const isPTC = sched === 'Conferences';
                            
                            let bgClass = "bg-[#7b9626] border-[#657d1f] text-white";
                            if (isRegularDay) {
                              bgClass = "bg-[#fec707] border-[#e6b406] text-black";
                            } else if (isPTC) {
                              bgClass = "bg-[#f26544] border-[#d8583a] text-white";
                            }
                            
                            return (
                              <div className={cn(
                                "mt-2 mx-auto max-w-fit px-1.5 py-0.5 border text-[10px] font-bold rounded relative z-10 tracking-widest uppercase shadow-sm whitespace-nowrap",
                                bgClass
                              )}>
                                {sched}
                              </div>
                            );
                          })()}
                        </td>
                        {renderCell(day.dateStr, 'all')}
                        {renderCell(day.dateStr, 'g9')}
                        {renderCell(day.dateStr, 'g10')}
                        {renderCell(day.dateStr, 'g11')}
                        {renderCell(day.dateStr, 'g12')}
                      </tr>
                    )})}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </main>

      {editingCell && (
        <EditModal 
          event={events[`${editingCell.date}-${editingCell.grade}`] || null}
          cellDate={editingCell.date}
          cellGrade={editingCell.grade}
          onSave={handleSaveEvent}
          onClose={() => setEditingCell(null)}
        />
      )}
    </div>
  );
}
