
import React, { useState } from 'react';

interface Props {
  onLogin: (key: string) => boolean;
}

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8 space-y-12 animate-in fade-in duration-700">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100 rotate-12">
          <svg className="w-12 h-12 text-white -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kasa</h1>
        <p className="text-slate-400 mt-2 font-medium">Lütfen kimliğinizi doğrulayın</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="relative">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={`w-full p-4 bg-slate-50 border-2 rounded-2xl focus:ring-4 outline-none transition-all text-center text-xl tracking-widest ${
              error ? 'border-red-300 focus:ring-red-100' : 'border-slate-100 focus:ring-indigo-100'
            }`}
            placeholder="Master Şifre"
          />
          {error && <p className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-xs font-semibold">Hatalı Şifre</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all"
        >
          Giriş Yap
        </button>
      </form>

      <div className="flex justify-center space-x-1">
        {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />)}
      </div>
    </div>
  );
};

export default LoginScreen;
