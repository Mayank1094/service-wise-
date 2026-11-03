import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after login (default is /predict)
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/predict';

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isRegister) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    try {
      setSubmitting(true);
      if (isRegister) {
        await signUpWithEmail(email, password, name.trim() || undefined);
      } else {
        await signInWithEmail(email, password);
      }
      // Successfully authenticated -> route to calculate/predict page
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('Email authentication error:', err);
      const firebaseError = err as { code?: string; message?: string };
      
      switch (firebaseError.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setError('An account with this email already exists. Please log in.');
          break;
        case 'auth/invalid-email':
          setError('Please provide a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please use at least 6 characters.');
          break;
        default:
          setError(firebaseError.message || 'An error occurred during authentication.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      setSubmitting(true);
      await signInWithGoogle();
      // Successfully authenticated with Google -> route to calculate/predict page
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('Google authentication error:', err);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in popup was closed before completing.');
      } else {
        setError(firebaseError.message || 'Failed to sign in with Google.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-[#F8F9FA] px-4 py-12">
      <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-xl shadow-black/[0.04] border border-[#E6E8ED] p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F2F5] text-xs font-semibold text-[#4E5664] mb-3">
            <span>ServiceWise Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101318]">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-[#66707C] mt-2">
            {isRegister
              ? 'Register with your email to estimate vehicle service costs'
              : 'Log in to access instant ML vehicle service cost calculations'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {/* 1. TOP: Email Login / Register Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4E5664] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8C95A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9DDE3] bg-white text-sm text-[#101318] placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-[#111820] focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4E5664] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C95A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9DDE3] bg-white text-sm text-[#101318] placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-[#111820] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4E5664] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C95A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#D9DDE3] bg-white text-sm text-[#101318] placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-[#111820] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C95A3] hover:text-[#101318] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4E5664] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C95A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D9DDE3] bg-white text-sm text-[#101318] placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-[#111820] focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button for Email */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-[46px] mt-2 inline-flex items-center justify-center rounded-xl bg-[#111820] text-white text-sm font-semibold hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                {isRegister ? 'Creating Account...' : 'Logging In...'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                {isRegister ? 'Register with Email' : 'Log In with Email'}
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* 2. MIDDLE: Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E6E8ED]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 font-medium text-[#8C95A3]">Or continue with</span>
          </div>
        </div>

        {/* 3. DOWN: Google Direct Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full h-[46px] inline-flex items-center justify-center gap-3 rounded-xl border border-[#D9DDE3] bg-white hover:bg-[#F8F9FA] text-[#101318] text-sm font-semibold transition-all hover:border-[#B5BBC6] hover:scale-[1.005] active:scale-[0.99] disabled:opacity-60 shadow-xs"
        >
          {/* Official Google SVG Icon */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* 4. BOTTOM: Register / Login Option Toggle */}
        <div className="mt-8 pt-6 border-t border-[#F0F2F5] text-center">
          {isRegister ? (
            <p className="text-sm text-[#66707C]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                }}
                className="font-semibold text-[#101318] hover:underline cursor-pointer ml-1"
              >
                Log In with Email
              </button>
            </p>
          ) : (
            <p className="text-sm text-[#66707C]">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                }}
                className="font-semibold text-[#101318] hover:underline cursor-pointer ml-1"
              >
                Register with Email
              </button>
            </p>
          )}
        </div>

        {/* Quick Trust indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8C95A3]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secure authentication powered by Firebase</span>
        </div>
      </div>
    </div>
  );
}

