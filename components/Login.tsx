
import React from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleGoogleLogin = () => {
    // Simulating Google Login
    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      name: 'Wereld Reiziger',
      email: 'reiziger@google.com',
      photoUrl: 'https://picsum.photos/seed/user/100/100'
    };
    onLogin(mockUser);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-2xl max-w-md w-full text-center">
        <div className="mb-6 inline-flex p-4 bg-blue-500/10 rounded-full">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">World Snap Roulette</h1>
        <p className="text-slate-400 mb-8">Deel je wereld, ontdek anderen. Maak een foto en stuur hem de wereld over.</p>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-6 h-6" />
          Inloggen met Google
        </button>
        
        <p className="mt-6 text-xs text-slate-500">
          Door in te loggen ga je akkoord met onze wereldwijde community richtlijnen.
        </p>
      </div>
    </div>
  );
};

export default Login;
