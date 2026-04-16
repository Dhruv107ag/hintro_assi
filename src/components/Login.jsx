import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, LogIn, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Required fields are missing.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-canvas">
      <div className="w-full max-w-lg">
        <div className="paper-card p-10 md:p-16 relative">
          <div className="mb-12">
            <div className="text-meta mb-3">
              Identity Verification
            </div>
            <h1 className="text-4xl font-bold text-ink tracking-tight mb-4">
              Aura <span className="font-light border-b border-ink/40">Space</span>
            </h1>
            <p className="text-ink/80 text-sm leading-relaxed">
              Access your digital workspace. Enter the credentials provided for your internship session.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">

              <div className="group">
                <label className="text-meta block mb-2 transition-colors group-focus-within:text-ink">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/60 transition-colors group-focus-within:text-ink" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-7 py-3 bg-transparent border-b border-ink/40 focus:border-ink/80 outline-none transition-all text-ink placeholder:text-ink/60"
                    placeholder="intern@demo.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-meta block mb-2 transition-colors group-focus-within:text-ink">Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/60 transition-colors group-focus-within:text-ink" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-7 py-3 bg-transparent border-b border-ink/40 focus:border-ink/80 outline-none transition-all text-ink placeholder:text-ink/60"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border transition-all ${rememberMe ? 'bg-ink border-ink' : 'bg-transparent border-ink/40'}`}>
                    {rememberMe && (
                      <svg className="w-3 h-3 text-canvas mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-ink/70 group-hover:text-ink transition-colors font-medium">Remember for 30 days</span>
              </label>
            </div>

            {error && (
              <div className="text-red-600 text-[11px] font-bold uppercase tracking-wider bg-red-50 p-3 border border-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-ink w-full group overflow-hidden"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
