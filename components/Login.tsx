
import React from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    // Simuleer Google Login voor deze demo
    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      name: 'Wereld Reiziger',
      email: 'reiziger@google.com',
      photoUrl: 'https://picsum.photos/seed/user/100/100'
    };
    onLogin(mockUser);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 px-6">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center">
        <div className="mb-8 inline-flex p-5 bg-blue-500/10 rounded-3xl text-blue-500">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-white mb-4 tracking-tight">World Snap</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-10">
          Deel een moment, ontvang een verrassing. Maak een foto en stuur hem de wereld over.
        </p>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-white hover:bg-slate-100 text-slate-900 font-bold py-5 px-6 rounded-2xl transition-all shadow-xl active:scale-[0.96]"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6" />
          Inloggen met Google
        </button>
        
        <p className="mt-8 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          Ontdek de wereld in realtime
        </p>
      </div>
    </div>
  );
};

export default Login;
