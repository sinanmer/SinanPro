
import React, { useState, useEffect } from 'react';
import { PasswordEntry } from '../types';
import { generateStrongPassword } from '../services/geminiService';

interface Props {
  entry: PasswordEntry | null;
  onClose: () => void;
  onSave: (entry: PasswordEntry) => void;
}

const EntryFormModal: React.FC<Props> = ({ entry, onClose, onSave }) => {
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (entry) {
      setPlatform(entry.platform);
      setUsername(entry.username);
      setPassword(entry.password);
      setDescription(entry.description);
    }
  }, [entry]);

  const handleGenerate = async () => {
    if (!platform) {
      alert("Lütfen önce bir platform adı girin.");
      return;
    }
    setIsGenerating(true);
    const pass = await generateStrongPassword(platform);
    setPassword(pass);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: PasswordEntry = {
      id: entry?.id || Date.now().toString(),
      platform,
      username,
      password,
      description,
      createdAt: entry?.createdAt || Date.now()
    };
    onSave(newEntry);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom-20 duration-500 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-800">
            {entry ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5 ml-1">Platform</label>
            <input
              required
              type="text"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
              placeholder="Örn: Google, Instagram..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5 ml-1">Kullanıcı Adı / E-posta</label>
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
              placeholder="kullanici@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5 ml-1">Şifre</label>
            <div className="relative group">
              <input
                required
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                placeholder="Şifreniz"
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="absolute right-3 top-2.5 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md flex items-center gap-1"
              >
                {isGenerating ? '...' : '✨ Üret'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5 ml-1">Açıklama (Opsiyonel)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
              placeholder="Bu şifre ne ile ilgili?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black active:scale-[0.98] transition-all mt-4"
          >
            {entry ? 'Güncelle' : 'Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EntryFormModal;
