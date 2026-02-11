
import React, { useState, useEffect, useMemo } from 'react';
import { PasswordEntry } from '../types';
import { storageService } from '../services/storageService';
import { getSecurityTip } from '../services/geminiService';
import EntryFormModal from './EntryFormModal';
import EntryCard from './EntryCard';

interface Props {
  onLogout: () => void;
}

const Dashboard: React.FC<Props> = ({ onLogout }) => {
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | null>(null);
  const [securityTip, setSecurityTip] = useState('Verilerinizi güvende tutun.');

  useEffect(() => {
    refreshEntries();
    fetchTip();
  }, []);

  const refreshEntries = () => {
    setEntries(storageService.getEntries());
  };

  const fetchTip = async () => {
    const tip = await getSecurityTip();
    setSecurityTip(tip);
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(e => 
      e.platform.toLowerCase().includes(search.toLowerCase()) ||
      e.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [entries, search]);

  const handleAddClick = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (entry: PasswordEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      storageService.deleteEntry(id);
      refreshEntries();
    }
  };

  const handleSave = (entry: PasswordEntry) => {
    if (editingEntry) {
      storageService.updateEntry(editingEntry.id, entry);
    } else {
      storageService.addEntry(entry);
    }
    refreshEntries();
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 border-b border-slate-100 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Kasa</h1>
          <button 
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Gemini Tip */}
        <div className="bg-indigo-50 p-4 rounded-2xl flex items-start gap-3 border border-indigo-100">
           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
             <span className="text-xs">✨</span>
           </div>
           <p className="text-xs text-indigo-700 leading-relaxed font-medium">
             {securityTip}
           </p>
        </div>

        {/* Search */}
        <div className="relative group">
          <input
            type="text"
            placeholder="Platform veya kullanıcı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
          />
          <svg className="w-5 h-5 absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-3 bg-slate-50">
        {filteredEntries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">Kayıt bulunamadı</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <EntryCard 
              key={entry.id} 
              entry={entry} 
              onEdit={() => handleEditClick(entry)}
              onDelete={() => handleDelete(entry.id)}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button 
        onClick={handleAddClick}
        className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-2xl shadow-indigo-300 flex items-center justify-center text-white active:scale-90 transition-all z-10 hover:bg-indigo-700"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {isModalOpen && (
        <EntryFormModal 
          entry={editingEntry} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default Dashboard;
